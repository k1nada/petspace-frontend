import { create } from "zustand";
import api from "@/config/axios";
import { User } from "@/types";

interface UserStore {
  currentUser: User | null;
  isLoading: boolean;
  fetchCurrentUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  currentUser: null,
  isLoading: true,
  fetchCurrentUser: async () => {
    try {
      const { data } = await api.get("/me");
      set({ currentUser: data, isLoading: false });
    } catch {
      set({ currentUser: null, isLoading: false });
    }
  },
}));
