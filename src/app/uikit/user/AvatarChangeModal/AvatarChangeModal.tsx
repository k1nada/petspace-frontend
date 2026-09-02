"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { uploadAvatar } from "@/services/api/upload";
import { Modal } from "@/app/uikit/overlays/Modal/Modal";
import { Button } from "@/app/uikit/form/Button/Button";
import { AvatarUploadModal } from "@/app/features/profile/modals/AvatarUploadModal/AvatarUploadModal";
import styles from "./AvatarChangeModal.module.scss";

export interface AvatarChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarSrc?: string;
  onAvatarChange?: (url: string | undefined) => void;
}

export const AvatarChangeModal = ({
  isOpen,
  onClose,
  currentAvatarSrc,
  onAvatarChange,
}: AvatarChangeModalProps) => {
  const t = useTranslations();
  const [file, setFile] = useState<File | null>(null);

  const savePhoto = async () => {
    try {
      if (!file) return;
      const avatar = await uploadAvatar(file);

      onAvatarChange?.(avatar.url);
      setFile(null);
      onClose();
      window.location.reload();
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className={styles.modalTitle}>{t("avatarEdit.modalTitle")}</h2>
      <p className={styles.description}>{t("avatarEdit.modalDescription")}</p>
      <p className={styles.hint}>{t("common.imageFormats")}</p>
      <div className={styles.upload}>
        <AvatarUploadModal
          onChange={setFile}
          profileAvatar={currentAvatarSrc}
        />
      </div>
      <p className={styles.hint}>{t("avatarEdit.choosePhoto")}</p>
      <div className={styles.actions}>
        <Button appearance="primary" onClick={savePhoto}>
          {t("common.saveAndContinue")}
        </Button>
      </div>
    </Modal>
  );
};
