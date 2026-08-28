"use client";

import styles from "./FeedLayout.module.scss";
import { useTranslations } from "next-intl";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { Tip } from "@/app/uikit/feedback/Tip/Tip";
import { TipSkeleton } from "@/app/uikit/feedback/Tip/TipSkeleton";
import { Postwall } from "@/app/features/profile/feed/Postwall/Postwall";
import { SuggestedFriends } from "@/app/features/feed/SuggestedFriends/SuggestedFriends";
import { useEffect, useState } from "react";
import { getFeed } from "@/app/api/post";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { Post } from "@/types";

export const FeedLayout = () => {
  const t = useTranslations();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingState, setLoadingState] = useState(true);
  const currentUser = useAuthStore((state) => state.currentUser);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);
  const loading = loadingState && !(isAuthChecked && !currentUser);

  const triggerRefresh = () => {
    if (!currentUser) return;
    getFeed(currentUser.username).then((data) => {
      setPosts(data ?? []);
      setLoadingState(false);
    });
  };

  useEffect(triggerRefresh, [currentUser]);

  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <Postwall
          posts={posts}
          loading={loading}
          onRefresh={triggerRefresh}
          emptyTitle={t("feed.friendsEmptyTitle")}
          emptyText={t("feed.friendsEmptyText")}
        />
      </div>
      <div className={styles.rightColumn}>
        <SuggestedFriends />
        {loading ? (
          <TipSkeleton />
        ) : (
          <Tip
            title={t("common.didYouKnow")}
            text={t("feedTip.text")}
            appearance="secondary"
          />
        )}
      </div>
    </div>
  );
};
