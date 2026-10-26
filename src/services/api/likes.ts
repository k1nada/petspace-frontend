import api from "@/config/axios";
import { LikeResponse } from "@/types";

export const likePost = async (postId: string): Promise<LikeResponse> => {
  const { data } = await api.post<LikeResponse>(`/likes/post/${postId}`);
  return data;
};

export const likeComment = async (commentId: string): Promise<LikeResponse> => {
  const { data } = await api.post<LikeResponse>(`/likes/comment/${commentId}`);
  return data;
};

export const likePhoto = async (photoId: string): Promise<LikeResponse> => {
  const { data } = await api.post<LikeResponse>(`/likes/photo/${photoId}`);
  return data;
};
