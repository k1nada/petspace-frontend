import api from "@/config/axios";

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

export const uploadPostPhoto = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/api/upload/photo", formData);
  return data.data.url as string;
};

export const getPosts = async (postwallId: string) => {
  try {
    const { data } = await api.get(`/posts/postwall/${postwallId}`);
    return data;
  } catch {
    return null;
  }
};

export const getFriendsFeed = async (username: string) => {
  try {
    const { data } = await api.get(`/posts/feed/${username}`);
    return data;
  } catch {
    return null;
  }
};
