"use client";

import { useEffect } from "react";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import styles from "./ProfileInterestsLayout.module.scss";
import { ProfileInterests } from "../ProfileInterests/ProfileInterests";
import ProfileInformation from "../ProfileInformation/ProfileInformation";
import { BannerInfo } from "@/types";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/routes/routes";

interface ProfileInterestLayout {
  user: BannerInfo;
}

export const ProfileInterestsLayout = ({ user }: ProfileInterestLayout) => {
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
        <ProfileInterests user={user} />
      </div>
      <div className={styles.information}>
        <ProfileInformation username={user.username} />
      </div>
    </div>
  );
};
