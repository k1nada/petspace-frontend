"use client";

import styles from "./FeedLayout.module.scss";
import { useTranslations } from "next-intl";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { Tip } from "@/app/uikit/feedback/Tip/Tip";
import { TipSkeleton } from "@/app/uikit/feedback/Tip/TipSkeleton";
import { Postwall } from "@/app/features/profile/feed/Postwall/Postwall";
import { SuggestedFriends } from "@/app/features/feed/SuggestedFriends/SuggestedFriends";
import { useEffect, useState } from "react";
import { getFriendsFeed } from "@/app/api/post";
import { useUserStore } from "@/app/hooks/useUserStore";
import { Post } from "@/types";
import { withMinDelay } from "@/utils/withMinDelay";

export const FeedLayout = () => {
  const t = useTranslations();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingState, setLoadingState] = useState(true);
  const currentUser = useUserStore((state) => state.currentUser);
  const isAuthChecked = useUserStore((state) => state.isAuthChecked);
  const loading = loadingState && !(isAuthChecked && !currentUser);

  const triggerRefresh = () => {
    if (!currentUser) return;
    withMinDelay(getFriendsFeed(currentUser.username)).then((data) => {
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
            title={t("feedTip.title")}
            text={t("feedTip.text")}
            appearance="secondary"
          />
        )}
      </div>
    </div>
  );
};
