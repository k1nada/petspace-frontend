import api from "@/config/axios";

export const likePost = async (postId: string) => {
  const { data } = await api.post(`/likes/post/${postId}`);
  return data;
};

export const likeComment = async (commentId: string) => {
  const { data } = await api.post(`/likes/comment/${commentId}`);
  return data;
};

export const likePhoto = async (photoId: string) => {
  const { data } = await api.post(`/likes/photo/${photoId}`);
  return data;
};
