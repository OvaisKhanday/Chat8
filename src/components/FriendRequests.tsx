"use client";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({ sessionId, incomingFriendRequests }) => {
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(incomingFriendRequests);
  const router = useRouter();

  useEffect(() => {
    const friendRequestHandler = ({ senderId, senderEmail }: IncomingFriendRequest) => {
      console.log("%c inside the subscription,", "color:red", senderId, senderEmail);
      setFriendRequests((prev) => [...prev, { senderId, senderEmail }]);
    };
    const channel = pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`));
    channel.bind("incoming_friend_requests", friendRequestHandler);
    return () => {
      channel.unbind("incoming_friend_requests", friendRequestHandler);
      // pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`));
    };
  }, []);

  const acceptFriend = async (senderId: string) => {
    await axios.post("/api/friends/accept", { id: senderId });
    setFriendRequests((prev) => prev.filter((req) => req.senderId !== senderId));
    router.refresh();
  };
  const denyFriend = async (senderId: string) => {
    await axios.post("/api/friends/deny", { id: senderId });
    setFriendRequests((prev) => prev.filter((req) => req.senderId !== senderId));
    router.refresh();
  };

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className='text-sm text-zinc-500'>Nothing to show...</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.senderId} className='flex gap-4 items-center'>
            <UserPlus className='text-black' />
            <p className='font-medium text-lg'>{request.senderEmail}</p>
            <button
              aria-label='accept friend'
              className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'
              onClick={() => acceptFriend(request.senderId)}
            >
              <Check className='font-semibold text-white w-3/4 h-3/4' />
            </button>
            <button
              aria-label='deny friend'
              className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'
              onClick={() => denyFriend(request.senderId)}
            >
              <X className='font-semibold text-white w-3/4 h-3/4' />
            </button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
