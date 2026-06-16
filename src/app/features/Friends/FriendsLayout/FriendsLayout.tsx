"use client";

import { useTranslations } from "next-intl";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import styles from "./FriendsLayout.module.scss";
import { Friends } from "../Friends/Friends";
import { FriendRequest } from "../FriendRequest/FriendRequest";
import { Tip } from "@/app/uikit/feedback/Tip/Tip";
import { useUserStore } from "@/app/hooks/useUserStore";
import { Friend } from "@/types";

interface FriendsLayoutProps {
  username: string;
  friends: Friend[];
}

export const FriendsLayout = ({ username, friends }: FriendsLayoutProps) => {
  const t = useTranslations();
  const currentUser = useUserStore((state) => state.currentUser);
  const isMyProfile = currentUser?.username === username;

  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <Friends
          friends={friends}
          currentUser={currentUser?.username || ""}
          isMyProfile={isMyProfile}
        />
      </div>
      <div className={styles.rightColumn}>
        <FriendRequest currentUser={username} />
        <Tip
          title={t("friendTip.title")}
          text={t("friendTip.text")}
          appearance="secondary"
        />
      </div>
    </div>
  );
};
