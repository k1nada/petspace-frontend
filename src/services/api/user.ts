import { isAxiosError } from "axios";
import { unstable_cache } from "next/cache";
import api from "@/config/axios";

export const getUser = unstable_cache(
  async (username: string) => {
    try {
      const { data } = await api.get(`/user/${username}`);
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
