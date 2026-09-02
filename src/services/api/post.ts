import api from "@/config/axios";
import { uploadPhoto } from "@/services/api/upload";

export const createPost = async (
  content: string,
  postwallId: string,
  image?: string,
) => {
  try {
    const { data } = await api.post("/posts", { content, postwallId, image });
    return data;
  } catch {
    return null;
  }
};

export const uploadPostPhoto = async (file: File): Promise<string> => {
  const photo = await uploadPhoto(file);
  return photo.url;
};

export const getPosts = async (postwallId: string) => {
  try {
    const { data } = await api.get(`/posts/postwall/${postwallId}`);
    return data;
  } catch {
    return null;
  }
};

export const getFeed = async (username: string) => {
  try {
    const { data } = await api.get(`/posts/feed/${username}`);
    return data;
  } catch {
    return null;
  }
};

export const deletePost = async (postId: string): Promise<void> => {
  await api.delete(`/posts/${postId}`);
};

export const repostPost = async (
  postId: string,
): Promise<{ reposted: boolean; count: number }> => {
  const { data } = await api.post(`/reposts/${postId}`);
  return data;
};

export const updatePost = async (
  postId: string,
  content: string,
): Promise<void> => {
  await api.put(`/posts/${postId}`, { content });
};
