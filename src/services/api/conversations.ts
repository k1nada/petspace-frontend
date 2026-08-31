import api from "@/config/axios";
import { ChatContact, Message } from "@/types";

export const getConversations = async (
  username: string,
): Promise<ChatContact[]> => {
  const { data } = await api.get(`/chat/conversations/${username}`);
  return data ?? [];
};

export const getMessages = async (roomId: string): Promise<Message[]> => {
  const { data } = await api.get(`/chat/${roomId}`);
  return data ?? [];
};

export const markMessagesRead = async (roomId: string): Promise<void> => {
  await api.post(`/chat/${roomId}/read`);
};
