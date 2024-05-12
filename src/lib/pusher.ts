import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: `${process.env.PUSHER_APP_ID}`,
  key: `${process.env.NEXT_PUBLIC_PUSHER_KEY}`,
  secret: `${process.env.PUSHER_SECRET}`,
  cluster: `${process.env.PUSHER_CLUSTER}`,
  useTLS: true,
});

export const pusherClient = new PusherClient(`${process.env.NEXT_PUBLIC_PUSHER_KEY}`, {
  cluster: "ap2",
  //   cluster: `${process.env.PUSHER_CLUSTER}`,
  // authEndpoint: "/api/pusher_auth",
  // authTransport: "ajax",
  // auth: {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // },
});
