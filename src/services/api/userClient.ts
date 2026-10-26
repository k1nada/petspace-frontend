import api from "@/config/axios";
import { Photo, User } from "@/types";

export const getUserByUsername = async (username: string): Promise<User> => {
  const { data } = await api.get<User>(`/user/${encodeURIComponent(username)}`);
  return data;
};

export const getUserPhotos = async (username: string): Promise<Photo[]> => {
  const { data } = await api.get<User>(`/user/${username}`);
  return data.photos ?? [];
};

export const searchUsers = async (query: string): Promise<User[]> => {
  const { data } = await api.get<User[]>(
    `/users/search?query=${encodeURIComponent(query)}`,
  );
  return data;
};
