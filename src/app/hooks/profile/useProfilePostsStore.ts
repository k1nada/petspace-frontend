import { create } from "zustand";
import { Post } from "@/types";

interface ProfilePostsStore {
  postwallId: string | null;
  posts: Post[];
  hasLoaded: boolean;
  setPosts: (postwallId: string, posts: Post[]) => void;
}

export const useProfilePostsStore = create<ProfilePostsStore>((set) => ({
  postwallId: null,
  posts: [],
  hasLoaded: false,

  setPosts: (postwallId, posts) => set({ postwallId, posts, hasLoaded: true }),
}));
