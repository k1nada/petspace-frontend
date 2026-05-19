"use client";
import { ProfileEditor } from "../ProfileEditor/ProfileEditor";
import styles from "./ProfileEditorLayout.module.scss";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import ProfileInformation from "../ProfileInformation/ProfileInformation";
import { BannerInfo } from "@/types";

interface ProfileEditorLayoutProps {
  user: BannerInfo;
}

export const ProfileEditorLayout = ({ user }: ProfileEditorLayoutProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <Sidebar/>
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
