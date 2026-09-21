import { isAxiosError } from "axios";
import { unstable_cache } from "next/cache";
import api from "@/config/axios";

export const getPostwall = unstable_cache(
  async (username: string) => {
    try {
      const { data } = await api.get(`/postwall/${username}`);
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
  ["get-postwall"],
  { revalidate: 5 },
);
