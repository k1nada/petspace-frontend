"use client";

import styles from "./RegistrationStepsAvatar.module.scss";
import { Button } from "@/app/uikit/form/Button/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routes/routes";
import { AvatarUploadModal } from "@/app/features/profile/modals/AvatarUploadModal/AvatarUploadModal";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "@/config/axios";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";

export const RegistrationStepsAvatar = () => {
  const router = useRouter();
  const t = useTranslations();
  const currentUser = useAuthStore((state) => state.currentUser);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const navigateToProfile = () => {
    if (currentUser) router.push(ROUTES.profile(currentUser.username));
  };

  const finishRegistration = async () => {
    try {
      await api.patch("/registration-steps", { onboardingCompleted: true });
    } catch {}
    navigateToProfile();
  };

  const saveAvatar = async () => {
    try {
      if (avatarFile) {
        const formData = new FormData();
        formData.append("image", avatarFile);
        await api.post("/api/upload/avatar", formData);
      }
      await finishRegistration();
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>{t("registrationStepsAvatar.title")}</h2>
        <p className={styles.subtitle}>
          {t("registrationStepsAvatar.subtitle")}
        </p>
        <div className={styles.divider} />
      </div>
      <div className={styles.avatar}>
        <AvatarUploadModal size={120} onChange={setAvatarFile} />
      </div>
      <div className={styles.actions}>
        <Button appearance="primary" onClick={saveAvatar}>
          {t("common.continue")}
        </Button>
        <Button appearance="secondary" onClick={finishRegistration}>
          {t("common.skip")}
        </Button>
      </div>
    </div>
  );
};
