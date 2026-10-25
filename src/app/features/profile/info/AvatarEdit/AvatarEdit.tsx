"use client";

import styles from "./AvatarEdit.module.scss";
import { Dropdown } from "@/app/uikit/overlays/Dropdown/Dropdown";
import { MdDelete, MdEdit, MdPhotoCamera } from "react-icons/md";
import { useTranslations } from "next-intl";
import defaultAvatar from "@/assets/avatars/default.png";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { useState } from "react";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";
import { toast } from "react-toastify";
import { AvatarChangeModal } from "../AvatarChangeModal/AvatarChangeModal";
import { PhotoModal } from "@/app/features/photos/PhotoModal/PhotoModal";
import { Photo } from "@/types";
import {
  deletePhoto as deletePhotoApi,
  deleteAvatar as deleteAvatarApi,
} from "@/services/api/upload";
import { revalidateUser } from "@/services/actions/revalidateUser";
import { usePhotoNavigation } from "@/app/hooks/photos/usePhotoNavigation";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";

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
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const [isChangeOpen, setIsChangeOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [localAvatarPhotos, setLocalAvatarPhotos] = useState(avatarPhotos);
  const [prevAvatarPhotos, setPrevAvatarPhotos] = useState(avatarPhotos);

  if (avatarPhotos !== prevAvatarPhotos) {
    setPrevAvatarPhotos(avatarPhotos);
    setLocalAvatarPhotos(avatarPhotos);
  }

  const newestFirstPhotos = [...(localAvatarPhotos ?? [])].reverse();
  const {
    selectedIndex,
    setSelectedIndex,
    handlePrev,
    handleNext,
    prevPhoto,
    nextPhoto,
  } = usePhotoNavigation(newestFirstPhotos);

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
      const { avatarChanged, avatar } = await deletePhotoApi(photoId);
      setLocalAvatarPhotos((prev) => prev?.filter((p) => p.id !== photoId));
      setSelectedIndex(null);

      if (avatarChanged) {
        onAvatarChange?.(avatar ?? undefined);
      }

      await revalidateUser();
      if (avatarChanged) {
        await fetchCurrentUser();
        router.refresh();
      }
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const deleteAvatar = async () => {
    try {
      await deleteAvatarApi();

      onAvatarChange?.(undefined);
      setIsDeleteOpen(false);
      await revalidateUser();
      await fetchCurrentUser();
      router.refresh();
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const hasAvatar = Boolean(src);

  const selectedPhoto =
    selectedIndex === null ? null : (newestFirstPhotos[selectedIndex] ?? null);

  if (!isEditable) {
    return (
      <div className={styles.wrapper}>
        <div
          className={styles.avatarWrapper}
          onClick={() => {
            if (hasAvatar) setSelectedIndex(0);
          }}
        >
          <Avatar src={src ?? defaultAvatar} size={size} />
        </div>

        <PhotoModal
          photo={selectedPhoto}
          author={{ name: name ?? "", username, avatar: src }}
          navigation={{
            photosCount: newestFirstPhotos.length,
            currentIndex: selectedIndex ?? 0,
            onPrev: handlePrev,
            onNext: handleNext,
            prevPhoto,
            nextPhoto,
          }}
          isOwner={false}
          onClose={() => setSelectedIndex(null)}
          onLikeChange={handleLikeChange}
          enableRepost
        />
      </div>
    );
  }

  const menuItems = [];
  if (hasAvatar) {
    menuItems.push({
      label: t("avatarEdit.open"),
      icon: <MdPhotoCamera size={20} />,
      onClick: () => setSelectedIndex(0),
    });
  }
  menuItems.push({
    label: t("avatarEdit.change"),
    icon: <MdEdit size={20} />,
    onClick: () => setIsChangeOpen(true),
  });
  if (hasAvatar) {
    menuItems.push({
      label: t("common.deletePhoto"),
      icon: <MdDelete size={20} />,
      onClick: () => setIsDeleteOpen(true),
    });
  }

  return (
    <>
      <Dropdown
        openOn="hover"
        align="center"
        className={styles.wrapper}
        items={menuItems}
        trigger={
          <div className={styles.avatarWrapper}>
            <Avatar src={src ?? defaultAvatar} size={size} />
          </div>
        }
      />

      <PhotoModal
        photo={selectedPhoto}
        author={{ name: name ?? "", username, avatar: src }}
        navigation={{
          photosCount: newestFirstPhotos.length,
          currentIndex: selectedIndex ?? 0,
          onPrev: handlePrev,
          onNext: handleNext,
          prevPhoto,
          nextPhoto,
        }}
        isOwner
        onClose={() => setSelectedIndex(null)}
        onDelete={() => {
          if (!selectedPhoto) return;
          deleteAvatarPhoto(selectedPhoto.id);
        }}
        onLikeChange={handleLikeChange}
        enableRepost
      />

      <AvatarChangeModal
        isOpen={isChangeOpen}
        onClose={() => setIsChangeOpen(false)}
        currentAvatarSrc={src}
        onAvatarChange={onAvatarChange}
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        title={t("avatarEdit.deleteModalTitle")}
        description={t("common.cannotUndo")}
        onConfirm={deleteAvatar}
        onClose={() => setIsDeleteOpen(false)}
      />
    </>
  );
};
