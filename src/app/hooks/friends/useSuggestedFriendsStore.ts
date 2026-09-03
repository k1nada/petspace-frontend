import { create } from "zustand";
import { User } from "@/types";

interface SuggestedFriendsStore {
  suggestions: User[];
  hasLoaded: boolean;
  setSuggestions: (suggestions: User[]) => void;
  reset: () => void;
}

export const useSuggestedFriendsStore = create<SuggestedFriendsStore>(
  (set) => ({
    suggestions: [],
    hasLoaded: false,

    setSuggestions: (suggestions) => set({ suggestions, hasLoaded: true }),
    reset: () => set({ suggestions: [], hasLoaded: false }),
  }),
);
