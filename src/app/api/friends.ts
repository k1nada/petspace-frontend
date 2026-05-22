import axios from "axios";
import api from "@/config/axios";
import { API_URL } from "@/config/env";
import { Friend } from "@/types";

export const getFriends = async (username: string): Promise<Friend[]> => {
  const { data } = await axios.get(`${API_URL}/friends/${username}`);
  return data ?? [];
};

export const addFriend = async (username: string, friendUsername: string) => {
  const { data } = await api.post(`/friends/${username}/add/${friendUsername}`);
  return data;
};

export const removeFriend = async (
  username: string,
  friendUsername: string,
) => {
  await api.delete(`/friends/${username}/remove/${friendUsername}`);
};
