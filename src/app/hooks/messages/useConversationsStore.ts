import { create } from "zustand";
import { ChatContact, ConversationMessage } from "@/types";

interface ConversationsStore {
  conversations: ChatContact[];
  hasLoaded: boolean;
  setConversations: (conversations: ChatContact[]) => void;
  receiveMessage: (
    contact: ChatContact,
    lastMessage: ConversationMessage,
    isUnread: boolean,
  ) => void;
  markContactRead: (contactId: string) => void;
  reset: () => void;
}

export const useConversationsStore = create<ConversationsStore>((set) => ({
  conversations: [],
  hasLoaded: false,

  setConversations: (conversations) => set({ conversations, hasLoaded: true }),

  receiveMessage: (contact, lastMessage, isUnread) =>
    set((state) => {
      const existing = state.conversations.find(
        (conv) => conv.id === contact.id,
      );
      const base = existing ?? contact;
      const unreadCount = base.unreadCount ?? 0;
      const updated = {
        ...base,
        lastMessage,
        unreadCount: isUnread ? unreadCount + 1 : unreadCount,
      };
      const others = state.conversations.filter(
        (conv) => conv.id !== contact.id,
      );
      return { conversations: [updated, ...others] };
    }),

  markContactRead: (contactId) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === contactId ? { ...conv, unreadCount: 0 } : conv,
      ),
    })),

  reset: () => set({ conversations: [], hasLoaded: false }),
}));
