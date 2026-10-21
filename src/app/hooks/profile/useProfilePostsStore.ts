import { create } from "zustand";
import { Post, PostChanges } from "@/types";

interface ProfilePostsStore {
  postwallId: string | null;
  posts: Post[];
  hasLoaded: boolean;
  setPosts: (postwallId: string, posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (postId: string, changes: PostChanges) => void;
  reset: () => void;
}

export const useProfilePostsStore = create<ProfilePostsStore>((set) => ({
  postwallId: null,
  posts: [],
  hasLoaded: false,

  setPosts: (postwallId, posts) => set({ postwallId, posts, hasLoaded: true }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  updatePost: (postId, changes) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, ...changes } : post,
      ),
    })),
  reset: () => set({ postwallId: null, posts: [], hasLoaded: false }),
}));
