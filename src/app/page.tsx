"use client";
import { Icons } from "@/components/Icons";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className='h-screen w-screen bg-gradient-to-r from-slate-400 to-slate-300'>
      <div className='max-w-md h-screen flex m-auto justify-center items-center'>
        <div className='flex flex-col text-center justify-center items-center '>
          <div className='flex gap-4'>
            <h1 className='bg-gradient-to-b from-gray-800 to-gray-700 bg-clip-text text-transparent font-extrabold text-6xl'>Chat8</h1>
            <Icons.Logo className='h-16 w-16 mb-4' />
          </div>
          <h2 className='text-slate-800 mt-4 sm:mt-8 font-bold text-xl'>Connect, Chat, Conquer: Your Real-Time Companion</h2>
          <p className='text-slate-800 my-2 sm:my-4'>
            {`Chat 8 is your ultimate real-time chat application, designed to bring people together seamlessly, no matter where they are. With its intuitive
        interface and robust features, Chat 8 empowers you to connect with friends, family, and colleagues instantly. Whether you're catching up with
        loved ones, collaborating on projects, or simply sharing moments, Chat 8 offers a secure and dynamic platform for all your conversations.
        Experience the future of communication with Chat 8 today!`}
          </p>
          <Button
            className='text-slate-200'
            onClick={() => {
              router.push("/login");
            }}
          >
            Login/Sign up
          </Button>
        </div>
      </div>
    </div>
  );
}
