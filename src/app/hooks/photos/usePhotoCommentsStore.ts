import { create } from "zustand";
import { Comment } from "@/types";

interface PhotoCommentsStore {
  commentsByPhotoId: Record<string, Comment[]>;
  setComments: (photoId: string, comments: Comment[]) => void;
  reset: () => void;
}

export const usePhotoCommentsStore = create<PhotoCommentsStore>((set) => ({
  commentsByPhotoId: {},

  setComments: (photoId, comments) =>
    set((state) => ({
      commentsByPhotoId: { ...state.commentsByPhotoId, [photoId]: comments },
    })),
  reset: () => set({ commentsByPhotoId: {} }),
}));
