import { create } from "zustand";
import { User } from "@/types";
import axios from "axios";
import { API_URL } from "@/config/env";

interface UserStore {
  currentUser: User | null;
  fetchCurrentUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  currentUser: null,
  fetchCurrentUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ currentUser: data });
    } catch {
      set({ currentUser: null });
    }
  },
}));