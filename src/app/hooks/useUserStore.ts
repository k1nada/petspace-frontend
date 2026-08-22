import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/config/axios";
import { getPendingRequests } from "@/app/api/friends";
import { FriendRequest, User } from "@/types";
import { withMinDelay } from "@/utils/withMinDelay";

interface UserStore {
  currentUser: User | null;
  isAuthChecked: boolean;
  requestCount: number;
  requests: FriendRequest[];
  fetchCurrentUser: (options?: { withDelay?: boolean }) => Promise<void>;
  setRequestCount: (count: number) => void;
  setRequests: (requests: FriendRequest[]) => void;
  signOut: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      currentUser: null,
      isAuthChecked: false,
      requestCount: 0,
      requests: [],

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
          set({ requests, requestCount: requests.length });
        } catch {}
      },

      setRequestCount: (count) => set({ requestCount: count }),
      setRequests: (requests) =>
        set({ requests, requestCount: requests.length }),
      signOut: () =>
        set({
          currentUser: null,
          requests: [],
          requestCount: 0,
        }),
    }),
    {
      name: "user",
      partialize: (state) => ({ currentUser: state.currentUser }),
    },
  ),
);
