"use client";

import styles from "./RegistrationStepsAvatar.module.scss";
import { Button } from "@/app/uikit/form/Button/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routes/routes";
import { AvatarUploadModal } from "@/app/features/profile/modals/AvatarUploadModal/AvatarUploadModal";
import { useState } from "react";
import { toast } from "react-toastify";
import { uploadAvatar } from "@/services/api/upload";
import { updateRegistrationSteps } from "@/services/api/auth";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";

export const RegistrationStepsAvatar = () => {
  const router = useRouter();
  const t = useTranslations();
  const currentUser = useAuthStore((state) => state.currentUser);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const navigateToProfile = () => {
    if (currentUser) router.push(ROUTES.profile(currentUser.username));
  };

  const completeOnboarding = async () => {
    try {
      await updateRegistrationSteps({ registrationCompleted: true });
    } catch {}
    navigateToProfile();
  };

  const finishRegistration = async () => {
    if (isSaving) return;
    setIsSaving(true);
    await completeOnboarding();
  };

  const saveAvatar = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (avatarFile) {
        await uploadAvatar(avatarFile);
      }
      await completeOnboarding();
    } catch {
      toast.error(t("toasts.error"));
      setIsSaving(false);
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
        <AvatarUploadModal
          size={120}
          onChange={setAvatarFile}
          disabled={isSaving}
        />
      </div>
      <div className={styles.actions}>
        <Button appearance="primary" onClick={saveAvatar} disabled={isSaving}>
          {t("common.continue")}
        </Button>
        <Button
          appearance="secondary"
          onClick={finishRegistration}
          disabled={isSaving}
        >
          {t("common.skip")}
        </Button>
      </div>
    </div>
  );
};
