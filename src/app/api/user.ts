import axios from "axios";
import { API_URL } from "@/config/env";

export const getUser = async (username: string) => {
  try {
    const { data } = await axios.get(`${API_URL}/user/${username}`);
    return data;
  } catch {
    return null;
  }
};
