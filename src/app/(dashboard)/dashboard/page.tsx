import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { FC } from "react";

interface pageProps {}

const Page: FC<pageProps> = async ({}) => {
  const session = await getServerSession(authOptions);
  return <h1>Dashboard</h1>;
};

export default Page;
