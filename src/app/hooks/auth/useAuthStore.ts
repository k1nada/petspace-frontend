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
import { useChatMessagesStore } from "@/app/hooks/messages/useChatMessagesStore";
import { useProfilePostsStore } from "@/app/hooks/profile/useProfilePostsStore";
import { usePresenceStore } from "@/app/hooks/shared/usePresenceStore";
import { usePhotoCommentsStore } from "@/app/hooks/photos/usePhotoCommentsStore";
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
          if (!localStorage.getItem("token")) {
            set({ currentUser: null, isAuthChecked: true });
            return;
          }

          let user: User | null = null;
          try {
            const response = await api.get<User>("/me");
            user = response.data;
          } catch (error) {
            if (isAxiosError(error) && error.response?.status !== 401) {
              set({ isAuthChecked: true });
              return;
            }
          }

          set({ currentUser: user, isAuthChecked: true });
          if (!user) return;

          let requests: FriendRequest[] = [];
          try {
            requests = await getPendingRequests(user.username);
          } catch {}
          useFriendRequestsStore.getState().setRequests(requests);

          let conversations: ChatContact[] = [];
          try {
            conversations = await getConversations(user.username);
          } catch {}

          let totalUnread = 0;
          for (const conversation of conversations) {
            totalUnread += conversation.unreadCount ?? 0;
          }
          useMessagesStore.getState().setUnreadMessagesCount(totalUnread);
        },

        signOut: () => {
          set({ currentUser: null });
          useFriendRequestsStore.getState().reset();
          useMessagesStore.getState().reset();
          useSuggestedFriendsStore.getState().reset();
          useFeedStore.getState().reset();
          useConversationsStore.getState().reset();
          useChatMessagesStore.getState().reset();
          useProfilePostsStore.getState().reset();
          usePresenceStore.getState().reset();
          usePhotoCommentsStore.getState().reset();
        },
      };
    },
    {
      name: "user",
      partialize: (state) => ({ currentUser: state.currentUser }),
    },
  ),
);
