import { isAxiosError } from "axios";
import { unstable_cache } from "next/cache";
import api from "@/config/axios";
import { User } from "@/types";

export const getUser = unstable_cache(
  async (username: string): Promise<User | null> => {
    try {
      const { data } = await api.get<User>(`/user/${username}`);
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
  ["get-user"],
  { revalidate: 5, tags: ["user", "follows"] },
);
