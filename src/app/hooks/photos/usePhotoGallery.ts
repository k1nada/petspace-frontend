import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import {
  uploadPhoto,
  deletePhoto as deletePhotoApi,
} from "@/services/api/upload";
import { revalidateUser } from "@/services/actions/revalidateUser";
import { Photo } from "@/types";
import { usePhotoLikeSync } from "@/app/hooks/photos/usePhotoLikeSync";
import { usePhotoLikeRefresh } from "@/app/hooks/photos/usePhotoLikeRefresh";

export const usePhotoGallery = (photos: Photo[], username: string) => {
  const t = useTranslations();
  const [localPhotos, setLocalPhotos] = useState<Photo[]>(photos);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  usePhotoLikeRefresh(username, setLocalPhotos);

  const uploadFile = async (file: File): Promise<Photo> => {
    const data = await uploadPhoto(file);
    return {
      id: data._id,
      publicId: data.public_id,
      createdAt: data.createdAt,
      liked: false,
      likesCount: 0,
    };
  };

  const addPhoto = async (files: File[]) => {
    const uploaded: Photo[] = [];
    let hasError = false;
    let photoLimitReached = false;

    for (const file of files) {
      try {
        uploaded.push(await uploadFile(file));
      } catch (error) {
        hasError = true;
        if (
          isAxiosError(error) &&
          error.response?.data?.type === "PHOTO_LIMIT_REACHED"
        ) {
          photoLimitReached = true;
        }
      }
    }

    if (uploaded.length > 0) {
      setLocalPhotos((prev) => [...prev, ...uploaded]);
    }

    if (hasError) {
      toast.error(
        photoLimitReached ? t("errors.PHOTO_LIMIT_REACHED") : t("toasts.error"),
      );
    } else {
      setIsUploadOpen(false);
      await revalidateUser();
      window.location.reload();
    }
  };

  const deletePhoto = async (photoId: string, onSuccess?: () => void) => {
    try {
      await deletePhotoApi(photoId);
      setLocalPhotos((prev) => prev.filter((p) => p.id !== photoId));
      onSuccess?.();
      await revalidateUser();
      window.location.reload();
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
