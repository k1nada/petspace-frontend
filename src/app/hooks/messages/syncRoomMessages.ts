import { getMessages } from "@/services/api/conversations";
import { useChatMessagesStore } from "./useChatMessagesStore";
import { Message } from "@/types";

const MAX_PAGE_SIZE = 50;

export const getSentMessages = (messages: Message[]) =>
  messages.filter((item) => !item.status);

const loadLatest = async (roomId: string) => {
  const page = await getMessages(roomId);
  useChatMessagesStore
    .getState()
    .setLatestMessages(roomId, page.messages, page.hasMore);
};

export const syncRoomMessages = async (roomId: string) => {
  const room = useChatMessagesStore.getState().rooms[roomId];
  const sentMessages = room ? getSentMessages(room.messages) : [];
  const lastMessage = sentMessages[sentMessages.length - 1];
  if (!room?.isLoaded || !lastMessage) {
    await loadLatest(roomId);
    return;
  }

  const page = await getMessages(roomId, {
    after: lastMessage.id,
    limit: MAX_PAGE_SIZE,
  });
  if (page.hasMore) {
    await loadLatest(roomId);
    return;
  }
  useChatMessagesStore.getState().addNewMessages(roomId, page.messages);
};
