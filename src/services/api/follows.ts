import { unstable_cache } from "next/cache";
import api from "@/config/axios";
import { FollowUser } from "@/types";

export const getFollowers = unstable_cache(
  async (username: string): Promise<FollowUser[]> => {
    const { data } = await api.get<FollowUser[]>(`/followers/${username}`);
    return data;
  },
  ["get-followers"],
  { revalidate: 30, tags: ["follows"] },
);

export const getFollowing = unstable_cache(
  async (username: string): Promise<FollowUser[]> => {
    const { data } = await api.get<FollowUser[]>(`/following/${username}`);
    return data;
  },
  ["get-following"],
  { revalidate: 30, tags: ["follows"] },
);

export const followUser = async (
  username: string,
  targetUsername: string,
): Promise<void> => {
  await api.post(`/following/${username}/${targetUsername}`);
};

export const unfollowUser = async (
  username: string,
  targetUsername: string,
): Promise<void> => {
  await api.delete(`/following/${username}/${targetUsername}`);
};

export const removeFollower = async (
  username: string,
  followerUsername: string,
): Promise<void> => {
  await api.delete(`/followers/${username}/${followerUsername}`);
};
