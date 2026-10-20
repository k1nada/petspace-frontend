import { create } from "zustand";
import { Message } from "@/types";

export interface RoomMessages {
  messages: Message[];
  hasMore: boolean;
  isLoadingOlder: boolean;
  isLoaded: boolean;
}

interface ChatMessagesStore {
  rooms: Record<string, RoomMessages>;
  setLatestMessages: (
    roomId: string,
    messages: Message[],
    hasMore: boolean,
  ) => void;
  addOlderMessages: (
    roomId: string,
    messages: Message[],
    hasMore: boolean,
  ) => void;
  addNewMessages: (roomId: string, messages: Message[]) => void;
  confirmMessage: (roomId: string, tempId: string, message: Message) => void;
  setMessageStatus: (
    roomId: string,
    tempId: string,
    status: "sending" | "failed",
  ) => void;
  setLoadingOlder: (roomId: string, isLoadingOlder: boolean) => void;
  reset: () => void;
}

const isLater = (a: Message, b: Message) => {
  if (a.createdAt !== b.createdAt) return a.createdAt > b.createdAt;
  return a.id > b.id;
};

const createEmptyRoom = (): RoomMessages => ({
  messages: [],
  hasMore: true,
  isLoadingOlder: false,
  isLoaded: false,
});

const mergeMessages = (current: Message[], incoming: Message[]) => {
  const knownIds = new Set(current.map((message) => message.id));
  const fresh = incoming.filter((message) => !knownIds.has(message.id));
  if (fresh.length === 0) return current;
  return [...current, ...fresh].sort((a, b) => (isLater(a, b) ? 1 : -1));
};

export const useChatMessagesStore = create<ChatMessagesStore>((set) => ({
  rooms: {},

  setLatestMessages: (roomId, messages, hasMore) =>
    set((state) => {
      const current = state.rooms[roomId]?.messages ?? [];
      const newest = messages[messages.length - 1];
      const newerThanPage = newest
        ? current.filter((message) => isLater(message, newest))
        : current;
      return {
        rooms: {
          ...state.rooms,
          [roomId]: {
            messages: mergeMessages(messages, newerThanPage),
            hasMore,
            isLoadingOlder: false,
            isLoaded: true,
          },
        },
      };
    }),

  addOlderMessages: (roomId, messages, hasMore) =>
    set((state) => {
      const room = state.rooms[roomId];
      if (!room) return state;
      return {
        rooms: {
          ...state.rooms,
          [roomId]: {
            ...room,
            messages: mergeMessages(room.messages, messages),
            hasMore,
            isLoadingOlder: false,
          },
        },
      };
    }),

  addNewMessages: (roomId, messages) =>
    set((state) => {
      const room = state.rooms[roomId] ?? createEmptyRoom();
      return {
        rooms: {
          ...state.rooms,
          [roomId]: {
            ...room,
            messages: mergeMessages(room.messages, messages),
          },
        },
      };
    }),

  confirmMessage: (roomId, tempId, message) =>
    set((state) => {
      const room = state.rooms[roomId] ?? createEmptyRoom();
      const withoutTemp = room.messages.filter((item) => item.id !== tempId);
      return {
        rooms: {
          ...state.rooms,
          [roomId]: {
            ...room,
            messages: mergeMessages(withoutTemp, [message]),
          },
        },
      };
    }),

  setMessageStatus: (roomId, tempId, status) =>
    set((state) => {
      const room = state.rooms[roomId];
      if (!room) return state;
      return {
        rooms: {
          ...state.rooms,
          [roomId]: {
            ...room,
            messages: room.messages.map((item) =>
              item.id === tempId ? { ...item, status } : item,
            ),
          },
        },
      };
    }),

  setLoadingOlder: (roomId, isLoadingOlder) =>
    set((state) => {
      const room = state.rooms[roomId];
      if (!room) return state;
      return {
        rooms: { ...state.rooms, [roomId]: { ...room, isLoadingOlder } },
      };
    }),

  reset: () => set({ rooms: {} }),
}));
