import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/config/axios";
import { getPendingRequests } from "@/app/api/friends";
import { useFriendRequestsStore } from "@/app/hooks/useFriendRequestsStore";
import { User } from "@/types";
import { withMinDelay } from "@/utils/withMinDelay";

interface AuthStore {
  currentUser: User | null;
  isAuthChecked: boolean;
  fetchCurrentUser: (options?: { withDelay?: boolean }) => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      currentUser: null,
      isAuthChecked: false,

      fetchCurrentUser: async (options) => {
        let user: User;
        try {
          const request = api.get<User>("/me");
          const { data } = await (options?.withDelay
            ? withMinDelay(request)
            : request);
          user = data;
        } catch {
          set({ currentUser: null, isAuthChecked: true });
          return;
        }

        set({ currentUser: user, isAuthChecked: true });

        try {
          const requests = await getPendingRequests(user.username);
          useFriendRequestsStore.getState().setRequests(requests);
        } catch {}
      },

      signOut: () => {
        set({ currentUser: null });
        useFriendRequestsStore.getState().reset();
      },
    }),
    {
      name: "user",
      partialize: (state) => ({ currentUser: state.currentUser }),
    },
  ),
);
