"use client";
import { useEffect } from "react";
import { ProfileEditor } from "../ProfileEditor/ProfileEditor";
import styles from "./ProfileEditorLayout.module.scss";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import ProfileInformation from "../ProfileInformation/ProfileInformation";
import { BannerInfo } from "@/types";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/routes/routes";

interface ProfileEditorLayoutProps {
  user: BannerInfo;
}

export const ProfileEditorLayout = ({ user }: ProfileEditorLayoutProps) => {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);
  const isOwner = currentUser?.username === user.username;

  useEffect(() => {
    if (isAuthChecked && !isOwner) {
      router.push(ROUTES.profile(user.username));
    }
  }, [isAuthChecked, isOwner, router, user.username]);

  if (!isAuthChecked) return null;
  if (!isOwner) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <ProfileEditor user={user} />
      </div>
      <div className={styles.information}>
        <ProfileInformation username={user.username}></ProfileInformation>
      </div>
    </div>
  );
};
