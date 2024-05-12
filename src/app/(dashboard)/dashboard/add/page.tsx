import AddFriendButton from "@/components/AddFriendButton";
import { FC } from "react";

const page: FC = ({}) => {
  return (
    <main className='pt-8 max-w-sm mx-auto'>
      <h1 className='font-bold text-center text-5xl mb-8'>Add a friend</h1>
      <AddFriendButton />
    </main>
  );
};

export default page;
