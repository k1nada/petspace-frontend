import api from "@/config/axios";

interface UploadedPhoto {
  url: string;
  public_id: string;
  _id: string;
  createdAt: string;
}

interface UploadedAvatar {
  url: string;
  public_id: string;
  photoId: string;
}

export const uploadPhoto = async (file: File): Promise<UploadedPhoto> => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/api/upload/photo", formData);
  return data.data;
};

export const deletePhoto = async (photoId: string): Promise<void> => {
  await api.delete(`/api/upload/photo/${photoId}`);
};

export const uploadAvatar = async (file: File): Promise<UploadedAvatar> => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/api/upload/avatar", formData);
  return data.data;
};

export const deleteAvatar = async (): Promise<void> => {
  await api.delete("/api/upload/avatar");
};
