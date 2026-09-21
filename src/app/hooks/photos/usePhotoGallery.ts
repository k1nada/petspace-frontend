import { useRef, useState } from "react";
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
import { useRouter } from "@/i18n/navigation";

export const usePhotoGallery = (photos: Photo[], username: string) => {
  const t = useTranslations();
  const router = useRouter();
  const [localPhotos, setLocalPhotos] = useState<Photo[]>(photos);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const hasLiked = useRef(false);
  usePhotoLikeRefresh(username, setLocalPhotos, hasLiked);

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
      router.refresh();
    }
  };

  const deletePhoto = async (photoId: string, onSuccess?: () => void) => {
    try {
      await deletePhotoApi(photoId);
      setLocalPhotos((prev) => prev.filter((p) => p.id !== photoId));
      onSuccess?.();
      await revalidateUser();
      router.refresh();
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const deleteAllPhotos = async (onSuccess?: () => void) => {
    let hasError = false;
    const deletedIds: string[] = [];

    for (const photo of localPhotos) {
      try {
        await deletePhotoApi(photo.id);
        deletedIds.push(photo.id);
      } catch {
        hasError = true;
      }
    }

    setLocalPhotos((prev) => prev.filter((p) => !deletedIds.includes(p.id)));

    if (hasError) {
      toast.error(t("toasts.error"));
    }

    onSuccess?.();
    await revalidateUser();
    router.refresh();
  };

  const handleLikeChange = usePhotoLikeSync(setLocalPhotos, hasLiked);

  return {
    localPhotos,
    isUploadOpen,
    setIsUploadOpen,
    addPhoto,
    deletePhoto,
    deleteAllPhotos,
    handleLikeChange,
  };
};
