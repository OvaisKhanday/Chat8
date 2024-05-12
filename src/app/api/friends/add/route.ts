import { getServerSession } from "next-auth";
import { addFriendValidator } from "../../../../lib/validations/add-friend";
import { authOptions } from "@/lib/auth";
import { fetchRedis } from "@/helpers/redis";
import { db } from "@/lib/db";
import { z } from "zod";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email: emailToAdd } = addFriendValidator.parse(body.email);
    // const RESTResponse = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/user:email:${emailToAdd.toLowerCase()}`, {
    //   headers: {
    //     Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
    //   },
    //   cache: "no-store",
    // });

    // const data = (await RESTResponse.json()) as { result: string };
    // console.log("res from redis", data);
    const idToAdd = (await fetchRedis("get", `user:email:${emailToAdd}`)) as string;
    const session = await getServerSession(authOptions);
    console.log("session", session);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (!idToAdd) {
      return new Response("Person does not exist", { status: 400 });
    }
    if (idToAdd === session.user.id) {
      return new Response("You cannot add yourself as a friend", { status: 400 });
    }

    //check if user is already added
    const isAlreadyAdded = await fetchRedis("sismember", `user:${idToAdd}:incoming_friend_requests`, session.user.id);
    if (isAlreadyAdded) return new Response("Already added this user", { status: 400 });
    const isAlreadyFriends = (await fetchRedis("sismember", `user:${session.user.id}:friends`, idToAdd)) as 0 | 1;
    if (isAlreadyFriends) return new Response("Already friends", { status: 400 });

    pusherServer.trigger(toPusherKey(`user:${idToAdd}:incoming_friend_requests`), "incoming_friend_requests", {
      senderId: session.user.id,
      senderEmail: session.user.email,
    });

    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);
    return new Response("OK"); // default status is 200
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Invalid Request", { status: 400 });
  }
}
