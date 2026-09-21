import api from "@/config/axios";
import { Photo, User } from "@/types";

export const getUserPhotos = async (username: string): Promise<Photo[]> => {
  const { data } = await api.get(`/user/${username}`);
  return data.photos ?? [];
};

export const searchUsers = async (query: string): Promise<User[]> => {
  const { data } = await api.get(
    `/users/search?query=${encodeURIComponent(query)}`,
  );
  return data;
};
