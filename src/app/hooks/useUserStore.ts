import { create } from "zustand";
import api from "@/config/axios";
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

export const useUserStore = create<UserStore>((set) => ({
  currentUser: null,
  isLoading: true,
  requestCount: 0,
  requests: [],
  fetchCurrentUser: async () => {
    try {
      const { data } = await api.get("/me");
      set({ 
        currentUser: data, 
        isLoading: false,
      });
    } catch {
      set({ currentUser: null, isLoading: false });
    }
  },
  setRequestCount: (count) => set({ requestCount: count }),
  setRequests: (requests) => set({ requests, requestCount: requests.length }),
}));
