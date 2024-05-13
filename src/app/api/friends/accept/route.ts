import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id: idToAccept } = z.object({ id: z.string() }).parse(body);
    const session = await getServerSession(authOptions);
    if (!session) return new Response("Authorized", { status: 401 });

    // verify if already friends
    const areAlreadyFriends = await fetchRedis("sismember", `user:${session.user.id}:friends`, idToAccept);
    if (areAlreadyFriends) return new Response("already friend", { status: 400 });

    // incoming req exists
    const hasFriendRequest = await fetchRedis("sismember", `user:${session.user.id}:incoming_friend_requests`, idToAccept);

    if (!hasFriendRequest) return new Response("No friend request", { status: 400 });

    const [userRaw, friendRaw] = (await Promise.all([fetchRedis("get", `user:${session.user.id}`), fetchRedis("get", `user:${idToAccept}`)])) as [
      string,
      string
    ];
    const user = JSON.parse(userRaw) as User;
    const friend = JSON.parse(friendRaw) as User;

    await Promise.all([
      pusherServer.trigger(toPusherKey(`user:${idToAccept}:friends`), "new_friend", user),
      pusherServer.trigger(toPusherKey(`user:${session.user.id}:friends`), "new_friend", friend),
      await db.sadd(`user:${session.user.id}:friends`, idToAccept), // add this id to my friend list
      await db.sadd(`user:${idToAccept}:friends`, session.user.id),
      //   await db.srem(`user:${idToAccept}:outbound_friend_requests`, session.user.id)
      await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAccept),
    ]);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) return new Response("Invalid Request", { status: 422 });

    return new Response("Invalid Request", { status: 400 });
  }
}
