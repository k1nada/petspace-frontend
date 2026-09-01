import axios from "axios";
import { unstable_cache } from "next/cache";
import api from "@/config/axios";
import { API_URL } from "@/config/env";
import { Friend, FriendRequest, User } from "@/types";

export const getFriends = unstable_cache(
  async (username: string): Promise<Friend[]> => {
    const { data } = await axios.get<Friend[]>(
      `${API_URL}/friends/${username}`,
    );
    return data;
  },
  ["get-friends"],
  { revalidate: 30 },
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
  await api.post(`/friends/${username}/add/${friendUsername}`);
};

export const deleteFriend = async (
  username: string,
  friendUsername: string,
): Promise<void> => {
  await api.delete(`/friends/${username}/delete/${friendUsername}`);
};

export const acceptFriendRequest = async (requestId: string): Promise<void> => {
  await api.post(`/friends/request/${requestId}/accept`);
};

export const rejectFriendRequest = async (requestId: string): Promise<void> => {
  await api.post(`/friends/request/${requestId}/reject`);
};
