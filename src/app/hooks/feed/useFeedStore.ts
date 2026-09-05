import { create } from "zustand";
import { Post } from "@/types";

interface FeedStore {
  posts: Post[];
  hasLoaded: boolean;
  setPosts: (posts: Post[]) => void;
  reset: () => void;
}

export const useFeedStore = create<FeedStore>((set) => ({
  posts: [],
  hasLoaded: false,

  setPosts: (posts) => set({ posts, hasLoaded: true }),
  reset: () => set({ posts: [], hasLoaded: false }),
}));
