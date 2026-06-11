"use client";

import { useTranslations } from "next-intl";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import styles from "./FriendsLayout.module.scss";
import { Friends } from "../Friends/Friends";
import { FriendRequest } from "../FriendRequest/FriendRequest";
import { Tip } from "@/app/uikit/feedback/Tip/Tip";
import { Friend } from "@/types";

interface FriendsLayoutProps {
  username: string;
  friends?: Friend[];
  requests?: Friend[];
}

export const FriendsLayout = ({
  username,
  friends,
  requests,
}: FriendsLayoutProps) => {
  const t = useTranslations();

  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <Friends friends={friends} currentUser={username} />
      </div>
      <div className={styles.rightColumn}>
        <FriendRequest requests={requests} currentUser={username} />
        <Tip
          title={t("friendTip.title")}
          text={t("friendTip.text")}
          appearance="secondary"
        />
      </div>
    </div>
  );
};