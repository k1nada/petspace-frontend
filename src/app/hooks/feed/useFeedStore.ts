import { create } from "zustand";
import { Post, PostChanges } from "@/types";

interface FeedStore {
  posts: Post[];
  hasLoaded: boolean;
  setPosts: (posts: Post[]) => void;
  updatePost: (postId: string, changes: PostChanges) => void;
  reset: () => void;
}

export const useFeedStore = create<FeedStore>((set) => ({
  posts: [],
  hasLoaded: false,

  setPosts: (posts) => set({ posts, hasLoaded: true }),
  updatePost: (postId, changes) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, ...changes } : post,
      ),
    })),
  reset: () => set({ posts: [], hasLoaded: false }),
}));
