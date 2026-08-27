import { create } from "zustand";

interface MessagesStore {
  unreadMessagesCount: number;
  activeRoomId: string | null;
  setUnreadMessagesCount: (count: number) => void;
  incrementUnreadMessagesCount: () => void;
  setActiveRoomId: (roomId: string | null) => void;
  reset: () => void;
}

export const useMessagesStore = create<MessagesStore>((set) => ({
  unreadMessagesCount: 0,
  activeRoomId: null,

  setUnreadMessagesCount: (count) => set({ unreadMessagesCount: count }),
  incrementUnreadMessagesCount: () =>
    set((state) => ({ unreadMessagesCount: state.unreadMessagesCount + 1 })),
  setActiveRoomId: (roomId) => set({ activeRoomId: roomId }),
  reset: () => set({ unreadMessagesCount: 0, activeRoomId: null }),
}));
