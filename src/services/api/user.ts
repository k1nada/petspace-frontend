import axios, { isAxiosError } from "axios";
import { API_URL } from "@/config/env";

export const getUser = async (username: string) => {
  try {
    const { data } = await axios.get(`${API_URL}/user/${username}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};
