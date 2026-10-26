import api from "@/config/axios";
import { ChatContact, MessageSearchResult, MessagesPage } from "@/types";

interface GetMessagesParams {
  before?: string;
  after?: string;
  limit?: number;
}

export const getConversations = async (
  username: string,
): Promise<ChatContact[]> => {
  const { data } = await api.get<ChatContact[]>(
    `/chat/conversations/${username}`,
  );
  return data ?? [];
};

export const searchMessages = async (
  query: string,
): Promise<MessageSearchResult[]> => {
  const { data } = await api.get<MessageSearchResult[]>("/chat/search", {
    params: { q: query },
  });
  return data ?? [];
};

export const getMessages = async (
  roomId: string,
  params: GetMessagesParams = {},
): Promise<MessagesPage> => {
  const { data } = await api.get<MessagesPage>(`/chat/${roomId}`, { params });
  return data;
};

export const markMessagesRead = async (roomId: string): Promise<void> => {
  await api.post(`/chat/${roomId}/read`);
};
