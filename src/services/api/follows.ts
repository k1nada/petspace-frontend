import api from "@/config/axios";
import { FollowUser } from "@/types";

export const getFollowers = async (username: string): Promise<FollowUser[]> => {
  const { data } = await api.get<FollowUser[]>(`/followers/${username}`);
  return data;
};

export const getFollowing = async (username: string): Promise<FollowUser[]> => {
  const { data } = await api.get<FollowUser[]>(`/following/${username}`);
  return data;
};

export const followUser = async (
  username: string,
  targetUsername: string,
): Promise<void> => {
  await api.post(`/followers/${username}/follow/${targetUsername}`);
};

export const unfollowUser = async (
  username: string,
  targetUsername: string,
): Promise<void> => {
  await api.delete(`/followers/${username}/unfollow/${targetUsername}`);
};

export const removeFollower = async (
  username: string,
  followerUsername: string,
): Promise<void> => {
  await api.delete(`/followers/${username}/remove/${followerUsername}`);
};
