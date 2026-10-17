import { unstable_cache } from "next/cache";
import api from "@/config/axios";
import { Friend, FriendRequest, User } from "@/types";

export const getFriends = unstable_cache(
  async (username: string): Promise<Friend[]> => {
    const { data } = await api.get<Friend[]>(`/friends/${username}`);
    return data;
  },
  ["get-friends"],
  { revalidate: 5 },
);

export const getSuggestedFriends = async (
  username: string,
): Promise<User[]> => {
  const { data } = await api.get<User[]>(`/friends/${username}/suggestions`);
  return data;
};

export const getPendingRequests = async (
  username: string,
): Promise<FriendRequest[]> => {
  const { data } = await api.get<FriendRequest[]>(
    `/friends/requests/${username}/pending`,
  );
  return data;
};

export const addFriend = async (
  username: string,
  friendUsername: string,
): Promise<void> => {
  await api.post(`/friends/${username}/${friendUsername}`);
};

export const deleteFriend = async (
  username: string,
  friendUsername: string,
): Promise<void> => {
  await api.delete(`/friends/${username}/${friendUsername}`);
};

export const acceptFriendRequest = async (requestId: string): Promise<void> => {
  await api.patch(`/friends/request/${requestId}`, { status: "accepted" });
};

export const rejectFriendRequest = async (requestId: string): Promise<void> => {
  await api.patch(`/friends/request/${requestId}`, { status: "rejected" });
};
