import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/config/axios";
import { getPendingRequests } from "@/app/api/friends";
import { FriendRequest, User } from "@/types";

interface UserStore {
  currentUser: User | null;
  isLoading: boolean;
  requestCount: number;
  requests: FriendRequest[];
  fetchCurrentUser: () => Promise<void>;
  setRequestCount: (count: number) => void;
  setRequests: (requests: FriendRequest[]) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      currentUser: null,
      isLoading: true,
      requestCount: 0,
      requests: [],

      fetchCurrentUser: async () => {
        set({ isLoading: true });

        let user: User;
        try {
          const { data } = await api.get<User>("/me");
          user = data;
        } catch {
          set({ currentUser: null, isLoading: false });
          return;
        }

        set({ currentUser: user, isLoading: false });

        try {
          const requests = await getPendingRequests(user.username);
          set({ requests, requestCount: requests.length });
        } catch {}
      },

      setRequestCount: (count) => set({ requestCount: count }),
      setRequests: (requests) =>
        set({ requests, requestCount: requests.length }),
    }),
    {
      name: "user",
      partialize: (state) => ({ currentUser: state.currentUser }),
    },
  ),
);
