import axios from "axios";
import { unstable_cache } from "next/cache";
import { API_URL } from "@/config/env";
import api from "@/config/axios";
import { Photo, User } from "@/types";

export const getUser = unstable_cache(
  async (username: string) => {
    try {
      const { data } = await axios.get(`${API_URL}/user/${username}`);
      return data;
    } catch {
      return null;
    }
  },
  ["get-user"],
  { revalidate: 30 },
);

export const getUserPhotos = async (
  username: string,
): Promise<Photo[] | null> => {
  try {
    const { data } = await api.get(`/user/${username}`);
    return data.photos ?? null;
  } catch {
    return null;
  }
};

export const searchUsers = async (query: string): Promise<User[]> => {
  const { data } = await api.get(`/users/search?query=${encodeURIComponent(query)}`);
  return data;
};
