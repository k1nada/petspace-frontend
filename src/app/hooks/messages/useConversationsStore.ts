import { create } from "zustand";
import { ChatContact } from "@/types";

interface ConversationsStore {
  conversations: ChatContact[];
  hasLoaded: boolean;
  setConversations: (conversations: ChatContact[]) => void;
  updateConversations: (
    updater: (conversations: ChatContact[]) => ChatContact[],
  ) => void;
  reset: () => void;
}

export const useConversationsStore = create<ConversationsStore>((set) => ({
  conversations: [],
  hasLoaded: false,

  setConversations: (conversations) => set({ conversations, hasLoaded: true }),
  updateConversations: (updater) =>
    set((state) => ({ conversations: updater(state.conversations) })),
  reset: () => set({ conversations: [], hasLoaded: false }),
}));
