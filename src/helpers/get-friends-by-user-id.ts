import toast from "react-hot-toast";
import { fetchRedis } from "./redis";

export const getFriendsByUserId = async (userId: string) => {
  try {
    const friendsIds = (await fetchRedis("smembers", `user:${userId}:friends`)) as string[];
    const friends = await Promise.all(
      friendsIds.map(async (friendId) => {
        const friend = (await fetchRedis("get", `user:${friendId}`)) as string;
        const parsedFriend = JSON.parse(friend) as User;
        return parsedFriend;
      })
    );
    return friends;
  } catch (error) {
    toast.error("Error fetching friends");
  }
};
