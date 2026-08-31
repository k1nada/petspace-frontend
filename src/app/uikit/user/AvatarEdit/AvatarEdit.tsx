"use client";

import styles from "./AvatarEdit.module.scss";
import { Button } from "../../form/Button/Button";
import { MdDeleteSweep, MdModeEdit, MdPhotoCamera } from "react-icons/md";
import { useTranslations } from "next-intl";
import defaultAvatar from "@/public/avatars/default.png";
import { Avatar } from "../Avatar/Avatar";
import { useEffect, useState } from "react";
import { ConfirmModal } from "../../overlays/ConfirmModal/ConfirmModal";
import { toast } from "react-toastify";
import { AvatarChangeModal } from "../AvatarChangeModal/AvatarChangeModal";
import { PhotoModal } from "@/app/features/photos/PhotoModal/PhotoModal";
import { Photo } from "@/types";
import { useRouter } from "next/navigation";
import api from "@/config/axios";
import { usePhotoNavigation } from "@/app/hooks/photos/usePhotoNavigation";

interface AvatarEditProps {
  avatarPhotos?: Photo[];
  src?: string;
  name?: string;
  username?: string;
  size?: number;
  onAvatarChange?: (url: string | undefined) => void;
  isEditable?: boolean;
}

export const AvatarEdit = ({
  avatarPhotos,
  src,
  name,
  username,
  size,
  onAvatarChange,
  isEditable = true,
}: AvatarEditProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [isChangeOpen, setIsChangeOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [localAvatarPhotos, setLocalAvatarPhotos] = useState(avatarPhotos);

  useEffect(() => {
    setLocalAvatarPhotos(avatarPhotos);
  }, [avatarPhotos]);

  const newestFirstPhotos = [...(localAvatarPhotos ?? [])].reverse();
  const { selectedIndex, setSelectedIndex, handlePrev, handleNext } =
    usePhotoNavigation(newestFirstPhotos);

  const handleLikeChange = (
    photoId: string,
    liked: boolean,
    likesCount: number,
  ) => {
    if (!localAvatarPhotos) return;

    const updatedPhotos = localAvatarPhotos.map((photo) => {
      if (photo.id !== photoId) return photo;
      return { ...photo, liked, likesCount };
    });

    setLocalAvatarPhotos(updatedPhotos);
  };

  const deleteAvatarPhoto = async (photoId: string) => {
    try {
      await api.delete(`/api/upload/photo/${photoId}`);
      window.location.reload();
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const deleteAvatar = async () => {
    try {
      await api.delete("/api/upload/avatar");

      onAvatarChange?.(undefined);
      setIsDeleteOpen(false);
      router.refresh();
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  if (!isEditable) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.avatarWrapper}>
          <Avatar src={src ?? defaultAvatar} size={size} />
        </div>
      </div>
    );
  }

  const hasAvatar = Boolean(src);

  const selectedPhoto =
    selectedIndex === null ? null : (newestFirstPhotos[selectedIndex] ?? null);

  return (
    <div className={styles.wrapper}>
      <div className={styles.avatarWrapper}>
        <Avatar src={src ?? defaultAvatar} size={size} />
      </div>
      <div className={styles.overlay}>
        {hasAvatar && (
          <Button appearance="secondary" onClick={() => setSelectedIndex(0)}>
            <MdPhotoCamera size={20} />
            {t("avatarEdit.open")}
          </Button>
        )}
        <Button appearance="secondary" onClick={() => setIsChangeOpen(true)}>
          <MdModeEdit size={20} />
          {t("avatarEdit.change")}
        </Button>
        {hasAvatar && (
          <Button appearance="secondary" onClick={() => setIsDeleteOpen(true)}>
            <MdDeleteSweep size={20} />
            {t("common.deletePhoto")}
          </Button>
        )}
      </div>

      <PhotoModal
        photo={selectedPhoto}
        author={{ name: name ?? "", username, avatar: src }}
        navigation={{
          photosCount: newestFirstPhotos.length,
          currentIndex: selectedIndex ?? 0,
          onPrev: handlePrev,
          onNext: handleNext,
        }}
        isOwner
        onClose={() => setSelectedIndex(null)}
        onDelete={() => {
          if (!selectedPhoto) return;
          deleteAvatarPhoto(selectedPhoto.id);
        }}
        onLikeChange={handleLikeChange}
      />

      <AvatarChangeModal
        isOpen={isChangeOpen}
        onClose={() => setIsChangeOpen(false)}
        currentAvatarSrc={src}
        onAvatarChange={onAvatarChange}
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        title={t("common.deletePhoto")}
        description={t("avatarEdit.deleteModalDescription")}
        onConfirm={deleteAvatar}
        onClose={() => setIsDeleteOpen(false)}
      />
    </div>
  );
};
