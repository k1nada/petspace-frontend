import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import api from "@/config/axios";
import { Photo } from "@/types";
import { usePhotoLikeSync } from "@/app/hooks/photos/usePhotoLikeSync";
import { usePhotoLikeRefresh } from "@/app/hooks/photos/usePhotoLikeRefresh";

export const usePhotoGallery = (photos: Photo[], username: string) => {
  const t = useTranslations();
  const [localPhotos, setLocalPhotos] = useState<Photo[]>(photos);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  usePhotoLikeRefresh(username, setLocalPhotos);

  const uploadFile = async (file: File): Promise<Photo> => {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await api.post("/api/upload/photo", formData);
    return {
      id: data.data._id,
      publicId: data.data.public_id,
      createdAt: data.data.createdAt,
      liked: false,
      likesCount: 0,
    };
  };

  const addPhoto = async (files: File[]) => {
    try {
      const uploaded = await Promise.all(files.map(uploadFile));
      setLocalPhotos((prev) => [...prev, ...uploaded]);
      setIsUploadOpen(false);
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response?.data?.type === "PHOTO_LIMIT_REACHED"
      ) {
        toast.error(t("errors.PHOTO_LIMIT_REACHED"));
      } else {
        toast.error(t("toasts.error"));
      }
    }
  };

  const deletePhoto = async (photoId: string, onSuccess?: () => void) => {
    try {
      await api.delete(`/api/upload/photo/${photoId}`);
      setLocalPhotos((prev) => prev.filter((p) => p.id !== photoId));
      onSuccess?.();
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const handleLikeChange = usePhotoLikeSync(setLocalPhotos);

  return {
    localPhotos,
    isUploadOpen,
    setIsUploadOpen,
    addPhoto,
    deletePhoto,
    handleLikeChange,
  };
};
