import { unstable_cache } from "next/cache";
import api from "@/config/axios";

export const createComment = async (
  content: string,
  postId?: string,
  photoId?: string,
  replyCommentId?: string,
) => {
  try {
    const { data } = await api.post("/comments", {
      content,
      postId,
      photoId,
      replyCommentId,
    });
    return data;
  } catch {
    return null;
  }
};

export const getComments = async (postId: string) => {
  try {
    const { data } = await api.get(`/comments/postwall/${postId}`);
    return data;
  } catch {
    return null;
  }
};

export const getPhotoComments = unstable_cache(
  async (photoId: string) => {
    try {
      const { data } = await api.get(`/comments/photo/${photoId}`);
      return data;
    } catch {
      return null;
    }
  },
  ["get-photo-comments"],
  { revalidate: 30 },
);

export const deleteComment = async (commentId: string): Promise<void> => {
  await api.delete(`/comments/${commentId}`);
};

export const updateComment = async (
  commentId: string,
  content: string,
): Promise<void> => {
  await api.put(`/comments/${commentId}`, { content });
};
