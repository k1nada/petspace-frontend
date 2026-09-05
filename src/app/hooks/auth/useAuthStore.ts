import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isAxiosError } from "axios";
import api from "@/config/axios";
import { getPendingRequests } from "@/services/api/friends";
import { getConversations } from "@/services/api/conversations";
import { useFriendRequestsStore } from "@/app/hooks/friends/useFriendRequestsStore";
import { useMessagesStore } from "@/app/hooks/messages/useMessagesStore";
import { useSuggestedFriendsStore } from "@/app/hooks/friends/useSuggestedFriendsStore";
import { useFeedStore } from "@/app/hooks/feed/useFeedStore";
import { useConversationsStore } from "@/app/hooks/messages/useConversationsStore";
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

        fetchCurrentUser: async () => {
          let user: User | null = null;
          try {
            const response = await api.get<User>("/me");
            user = response.data;
          } catch (error) {
            if (isAxiosError(error) && error.response?.status !== 401) {
              set({ isAuthChecked: true });
              return;
            }
            user = null;
          }

          set({ currentUser: user, isAuthChecked: true });
          if (!user) return;

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

          const totalUnread = conversations.reduce(
            (sum, conversation) => sum + (conversation.unreadCount ?? 0),
            0,
          );
          useMessagesStore.getState().setUnreadMessagesCount(totalUnread);
        },

        signOut: () => {
          set({ currentUser: null });
          useFriendRequestsStore.getState().reset();
          useMessagesStore.getState().reset();
          useSuggestedFriendsStore.getState().reset();
          useFeedStore.getState().reset();
          useConversationsStore.getState().reset();
        },
      };
    },
    {
      name: "user",
      partialize: (state) => ({ currentUser: state.currentUser }),
    },
  ),
);
