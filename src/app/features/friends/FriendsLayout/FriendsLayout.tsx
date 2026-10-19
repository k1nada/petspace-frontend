"use client";

import { useTranslations } from "next-intl";
import { Tip } from "@/app/uikit/feedback/Tip/Tip";
import { TipSkeleton } from "@/app/uikit/feedback/Tip/TipSkeleton";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { useSuggestedFriendsStore } from "@/app/hooks/friends/useSuggestedFriendsStore";
import { useLoadSuggestedFriends } from "@/app/hooks/friends/useSuggestedFriends";
import { FollowUser, Friend } from "@/types";
import { SuggestedFriends } from "@/app/features/friends/SuggestedFriends/SuggestedFriends";
import { SuggestedFriendsSkeleton } from "@/app/features/friends/SuggestedFriends/SuggestedFriendsSkeleton";
import { Friends } from "../Friends/Friends";
import { FriendsSkeleton } from "../Friends/FriendsSkeleton";
import styles from "./FriendsLayout.module.scss";

interface FriendsLayoutProps {
  username: string;
  name: string;
  friends: Friend[];
  followers: FollowUser[];
  following: FollowUser[];
}

export const FriendsLayout = ({
  username,
  name,
  friends,
  followers,
  following,
}: FriendsLayoutProps) => {
  const t = useTranslations();
  const currentUser = useAuthStore((state) => state.currentUser);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);
  const suggestionsLoaded = useSuggestedFriendsStore(
    (state) => state.hasLoaded,
  );
  const isMyProfile = currentUser?.username === username;

  useLoadSuggestedFriends(isMyProfile ? username : undefined);

  const pageReady = isAuthChecked && (!isMyProfile || suggestionsLoaded);

  if (!pageReady) {
    return (
      <div className={styles.layout}>
        <div className={styles.content}>
          <FriendsSkeleton />
        </div>
        <div className={styles.rightColumn}>
          <SuggestedFriendsSkeleton />
          <TipSkeleton
            title={t("common.didYouKnow")}
            text={t("friendTip.text")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <Friends
          username={username}
          name={name}
          friends={friends}
          followers={followers}
          following={following}
          currentUser={currentUser?.username ?? ""}
          isMyProfile={isMyProfile}
        />
      </div>
      <div className={styles.rightColumn}>
        {isMyProfile && <SuggestedFriends />}
        <Tip title={t("common.didYouKnow")} text={t("friendTip.text")} />
      </div>
    </div>
  );
};
