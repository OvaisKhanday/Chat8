"use client";
import { chatHrefConstructor } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface SidebarChatListProps {
  friends: User[] | undefined;
  sessionId: string;
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionId }) => {
  const [unseenMessages, setUnseenMessages] = useState<Message[]>();
  const router = useRouter();
  const pathname = usePathname(); // relative pathname
  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((prev) => prev?.filter((msg) => !pathname.includes(msg.senderId)));
    }
  }, [pathname]);
  if (!friends) return <p>No friend</p>;
  return (
    <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
      {friends.sort().map((friend) => {
        console.log("friend", friend);
        const unseenMessageCount = unseenMessages?.filter((unseenMsg) => unseenMsg.senderId === friend.id).length;
        return (
          <li key={friend.id}>
            <a
              href={`/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`}
              className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
            >
              {friend.name}
              {unseenMessageCount && unseenMessageCount > 0 ? (
                <div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                  {unseenMessageCount}
                </div>
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
