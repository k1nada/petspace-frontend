"use client";

import styles from "./FriendsLayout.module.scss";
import { useTranslations } from "next-intl";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { Tip } from "@/app/uikit/feedback/Tip/Tip";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { FollowUser, Friend } from "@/types";
import { Friends } from "../Friends/Friends";
import { FriendsSkeleton } from "../Friends/FriendsSkeleton";
import { AuthLoader } from "@/app/components/AuthLoader/AuthLoader";
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
  const currentUser = useAuthStore((state) => state.currentUser);
  const isMyProfile = currentUser?.username === username;

  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <AuthLoader fallback={<FriendsSkeleton />}>
          <Friends
            username={username}
            friends={friends}
            followers={followers}
            following={following}
            currentUser={currentUser?.username || ""}
            isMyProfile={isMyProfile}
          />
        </AuthLoader>
      </div>
      <div className={styles.rightColumn}>
        <SuggestedFriends profileUsername={username} />
        <Tip
          title={t("common.didYouKnow")}
          text={t("friendTip.text")}
          appearance="secondary"
        />
      </div>
    </div>
  );
};
