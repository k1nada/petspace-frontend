import api from "@/config/axios";

interface UploadedPhoto {
  id: string;
  publicId: string;
  url: string;
  createdAt: string;
}

interface UploadedAvatar {
  id: string;
  publicId: string;
  url: string;
}

interface UploadedFamilyAvatar {
  url: string;
}

interface DeletedPhoto {
  avatarChanged: boolean;
  avatar: string | null;
}

export const uploadPhoto = async (file: File): Promise<UploadedPhoto> => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post<UploadedPhoto>("/api/upload/photo", formData);
  return data;
};

export const deletePhoto = async (photoId: string): Promise<DeletedPhoto> => {
  const { data } = await api.delete<DeletedPhoto>(
    `/api/upload/photo/${photoId}`,
  );
  return data;
};

export const uploadAvatar = async (file: File): Promise<UploadedAvatar> => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post<UploadedAvatar>(
    "/api/upload/avatar",
    formData,
  );
  return data;
};

export const uploadFamilyAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post<UploadedFamilyAvatar>(
    "/api/upload/family-avatar",
    formData,
  );
  return data.url;
};

export const deleteAvatar = async (): Promise<void> => {
  await api.delete("/api/upload/avatar");
};
