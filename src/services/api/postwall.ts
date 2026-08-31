import { API_URL } from "@/config/env";
import axios from "axios";

export const getPostwall = async (username: string) => {
  try {
    const { data } = await axios.get(`${API_URL}/postwall/${username}`);
    return data;
  } catch {
    return null;
  }
};
