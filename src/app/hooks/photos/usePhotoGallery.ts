import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { getUploadErrorKey } from "@/utils/uploadErrors";
import {
  uploadPhoto,
  deletePhoto as deletePhotoApi,
} from "@/services/api/upload";
import { revalidateUser } from "@/services/actions/revalidateUser";
import { Photo } from "@/types";
import { usePhotoLikeRefresh } from "@/app/hooks/photos/usePhotoLikeRefresh";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";

export const usePhotoGallery = (photos: Photo[], username: string) => {
  const t = useTranslations();
  const router = useRouter();
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const [localPhotos, setLocalPhotos] = useState<Photo[]>(photos);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const hasLiked = useRef(false);
  usePhotoLikeRefresh(username, setLocalPhotos, hasLiked);

  const uploadFile = async (file: File): Promise<Photo> => {
    const uploaded = await uploadPhoto(file);
    return {
      id: uploaded.id,
      publicId: uploaded.publicId,
      createdAt: uploaded.createdAt,
      liked: false,
      likesCount: 0,
    };
  };

  const addPhoto = async (files: File[]): Promise<File[]> => {
    const uploaded: Photo[] = [];
    const failedFiles: File[] = [];
    let errorKey = "toasts.error";

    for (const file of files) {
      try {
        uploaded.push(await uploadFile(file));
      } catch (error) {
        failedFiles.push(file);
        const fileErrorKey = getUploadErrorKey(error);
        if (fileErrorKey !== "toasts.error") errorKey = fileErrorKey;
      }
    }

    if (failedFiles.length > 0) {
      toast.error(t(errorKey));
    } else {
      setIsUploadOpen(false);
    }

    if (uploaded.length > 0) {
      setLocalPhotos((prev) => [...prev, ...uploaded]);
      await revalidateUser();
      router.refresh();
    }

    return failedFiles;
  };

  const deletePhoto = async (photoId: string, onSuccess?: () => void) => {
    try {
      const { avatarChanged } = await deletePhotoApi(photoId);
      setLocalPhotos((prev) => prev.filter((p) => p.id !== photoId));
      onSuccess?.();
      if (avatarChanged) await fetchCurrentUser();
      await revalidateUser();
      router.refresh();
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const deleteAllPhotos = async (onSuccess?: () => void) => {
    let hasError = false;
    let avatarChanged = false;
    const deletedIds: string[] = [];

    for (const photo of localPhotos) {
      try {
        const result = await deletePhotoApi(photo.id);
        deletedIds.push(photo.id);
        if (result.avatarChanged) avatarChanged = true;
      } catch {
        hasError = true;
      }
    }

    setLocalPhotos((prev) => prev.filter((p) => !deletedIds.includes(p.id)));

    if (hasError) {
      toast.error(t("toasts.error"));
    }

    onSuccess?.();
    if (avatarChanged) await fetchCurrentUser();
    await revalidateUser();
    router.refresh();
  };

  const handleLikeChange = (
    photoId: string,
    liked: boolean,
    likesCount: number,
  ) => {
    hasLiked.current = true;
    setLocalPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, liked, likesCount } : p)),
    );
  };

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
