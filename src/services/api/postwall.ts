import { API_URL } from "@/config/env";
import axios from "axios";
import { unstable_cache } from "next/cache";

export const getPostwall = unstable_cache(
  async (username: string) => {
    try {
      const { data } = await axios.get(`${API_URL}/postwall/${username}`);
      return data;
    } catch {
      return null;
    }
  },
  ["get-postwall"],
  { revalidate: 30 },
);
