import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/config/axios";
import { getPendingRequests } from "@/services/api/friends";
import { getConversations } from "@/services/api/conversations";
import { useFriendRequestsStore } from "@/app/hooks/friends/useFriendRequestsStore";
import { useMessagesStore } from "@/app/hooks/messages/useMessagesStore";
import { ChatContact, FriendRequest, User } from "@/types";

interface AuthStore {
  currentUser: User | null;
  isAuthChecked: boolean;
  fetchCurrentUser: () => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => {
      return {
        currentUser: null,
        isAuthChecked: false,

        fetchCurrentUser: async function () {
          let user: User | null = null;
          let gotUser = false;

          try {
            const response = await api.get<User>("/me");
            user = response.data;
            gotUser = true;
          } catch {
            gotUser = false;
          }

          if (gotUser === false || user === null) {
            set({ currentUser: null, isAuthChecked: true });
            return;
          }

          set({ currentUser: user, isAuthChecked: true });

          let requests: FriendRequest[] = [];
          try {
            requests = await getPendingRequests(user.username);
          } catch {
            requests = [];
          }
          useFriendRequestsStore.getState().setRequests(requests);

          let conversations: ChatContact[] = [];
          try {
            conversations = await getConversations(user.username);
          } catch {
            conversations = [];
          }

          let totalUnread = 0;
          for (let i = 0; i < conversations.length; i++) {
            const conversation = conversations[i];
            if (conversation.unreadCount) {
              totalUnread = totalUnread + conversation.unreadCount;
            }
          }
          useMessagesStore.getState().setUnreadMessagesCount(totalUnread);
        },

        signOut: function () {
          set({ currentUser: null });
          useFriendRequestsStore.getState().reset();
          useMessagesStore.getState().reset();
        },
      };
    },
    {
      name: "user",
      partialize: (state) => ({ currentUser: state.currentUser }),
    },
  ),
);
