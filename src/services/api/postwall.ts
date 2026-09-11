import { API_URL } from "@/config/env";
import axios, { isAxiosError } from "axios";
import { unstable_cache } from "next/cache";

export const getPostwall = unstable_cache(
  async (username: string) => {
    try {
      const { data } = await axios.get(`${API_URL}/postwall/${username}`);
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
  ["get-postwall"],
  { revalidate: 30 },
);
