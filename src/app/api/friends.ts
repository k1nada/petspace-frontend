import axios from "axios";
import api from "@/config/axios";
import { API_URL } from "@/config/env";
import { Friend, FriendRequest } from "@/types";

export const getFriends = async (username: string): Promise<Friend[]> => {
  const { data } = await axios.get<Friend[]>(`${API_URL}/friends/${username}`);
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