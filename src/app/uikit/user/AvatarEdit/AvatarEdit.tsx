"use client";

import styles from "./AvatarEdit.module.scss";
import { Button } from "../../form/Button/Button";
import { MdDeleteSweep, MdModeEdit, MdPhotoCamera } from "react-icons/md";
import { useTranslations } from "next-intl";
import defaultAvatar from "@/public/avatars/default.png";
import { Avatar } from "../Avatar/Avatar";
import { useState } from "react";
import { Modal } from "../../overlays/Modal/Modal";
import { toast } from "react-toastify";
import { CLOUD_NAME } from "@/config/env";
import { AvatarUploadModal } from "@/app/features/profile/modals/AvatarUploadModal/AvatarUploadModal";
import { PhotoModal } from "@/app/features/photos/PhotoModal/PhotoModal";
import { Photo } from "@/types";
import { useRouter } from "next/navigation";
import api from "@/config/axios";

interface AvatarEditProps {
  avatarPhotos?: Photo[];
  src?: string;
  name?: string;
  size?: number;
  onAvatarChange?: (url: string | undefined) => void;
}

export const AvatarEdit = ({
  avatarPhotos,
  src,
  name,
  size,
  onAvatarChange,
}: AvatarEditProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isChangeOpen, setIsChangeOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openPhoto = () => {
    setCurrentIndex((avatarPhotos?.length ?? 1) - 1);
    setIsPhotoOpen(true);
  };

  const savePhoto = async () => {
    try {
      if (!file) return;
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await api.post("/api/upload/avatar", formData);

      onAvatarChange?.(data.data.url);
      setFile(null);
      setIsChangeOpen(false);
      router.refresh();
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

  return (
    <div className={styles.wrapper}>
      <div className={styles.avatarWrapper}>
        <Avatar src={src ?? defaultAvatar} size={size} />
      </div>
      <div className={styles.overlay}>
        {src && (
          <Button appearance="secondary" onClick={openPhoto}>
            <MdPhotoCamera size={20} />
            {t("avatarEdit.open")}
          </Button>
        )}
        <Button appearance="secondary" onClick={() => setIsChangeOpen(true)}>
          <MdModeEdit size={20} />
          {t("avatarEdit.change")}
        </Button>
        {src && (
          <Button appearance="secondary" onClick={() => setIsDeleteOpen(true)}>
            <MdDeleteSweep size={20} />
            {t("avatarEdit.delete")}
          </Button>
        )}
      </div>

      <PhotoModal
        photo={isPhotoOpen ? (avatarPhotos?.[currentIndex] ?? null) : null}
        name={name ?? ""}
        avatar={src}
        cloudName={CLOUD_NAME}
        photosCount={avatarPhotos?.length ?? 0}
        currentIndex={(avatarPhotos?.length ?? 1) - 1 - currentIndex}
        onClose={() => setIsPhotoOpen(false)}
        onPrev={() =>
          setCurrentIndex((i) =>
            Math.min((avatarPhotos?.length ?? 1) - 1, i + 1),
          )
        }
        onNext={() => setCurrentIndex((i) => Math.max(0, i - 1))}
      />

      <Modal isOpen={isChangeOpen} onClose={() => setIsChangeOpen(false)}>
        <h2 className={styles.modalTitle}>{t("avatarEdit.modalTitle")}</h2>
        <p className={styles.description}>{t("avatarEdit.modalDescription")}</p>
        <p className={styles.hint}>{t("avatarEdit.modalFormats")}</p>
        <div className={styles.upload}>
          <AvatarUploadModal onChange={setFile} profileAvatar={src} />
        </div>
        <p className={styles.hint}>{t("avatarEdit.choosePhoto")}</p>
        <div className={styles.actions}>
          <Button appearance="primary" onClick={savePhoto}>
            {t("common.saveAndContinue")}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <h2 className={styles.modalTitle}>{t("avatarEdit.deleteModalTitle")}</h2>
        <p className={styles.deleteDescription}>
          {t("avatarEdit.deleteModalDescription")}
        </p>
        <div className={styles.actions}>
          <Button appearance="secondary" onClick={() => setIsDeleteOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={deleteAvatar}>
            {t("avatarEdit.delete")}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
