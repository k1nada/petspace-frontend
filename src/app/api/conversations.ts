import axios from "axios";
import { API_URL } from "@/config/env";
import { ChatContact } from "@/types";

export const getConversations = async (
  username: string,
): Promise<ChatContact[]> => {
  const { data } = await axios.get(`${API_URL}/friends/${username}`);
  return data ?? [];
};
