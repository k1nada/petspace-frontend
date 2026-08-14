"use client";

import styles from "./FriendsLayout.module.scss";
import { useTranslations } from "next-intl";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { Tip } from "@/app/uikit/feedback/Tip/Tip";
import { useUserStore } from "@/app/hooks/useUserStore";
import { FollowUser, Friend } from "@/types";
import { Friends } from "../Friends/Friends";
import { SuggestedFriends } from "@/app/features/feed/SuggestedFriends/SuggestedFriends";

interface FriendsLayoutProps {
  username: string;
  friends: Friend[];
  followers: FollowUser[];
  following: FollowUser[];
}

export const FriendsLayout = ({
  username,
  friends,
  followers,
  following,
}: FriendsLayoutProps) => {
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
          username={username}
          friends={friends}
          followers={followers}
          following={following}
          currentUser={currentUser?.username || ""}
          isMyProfile={isMyProfile}
        />
      </div>
      <div className={styles.rightColumn}>
        {isMyProfile && <SuggestedFriends />}
        <Tip
          title={t("friendTip.title")}
          text={t("friendTip.text")}
          appearance="secondary"
        />
      </div>
    </div>
  );
};
