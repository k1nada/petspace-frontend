"use client";

import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import styles from "./ProfileInterestsLayout.module.scss";
import { ProfileInterests } from "../ProfileInterests/ProfileInterests";
import ProfileInformation from "../ProfileInformation/ProfileInformation";
import { BannerInfo } from "@/types";

interface ProfileInterestLayout {
  user: BannerInfo;
}

export const ProfileInterestsLayout = ({ user }: ProfileInterestLayout) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <Sidebar/>
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
