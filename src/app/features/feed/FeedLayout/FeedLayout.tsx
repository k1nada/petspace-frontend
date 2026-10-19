"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Tip } from "@/app/uikit/feedback/Tip/Tip";
import { TipSkeleton } from "@/app/uikit/feedback/Tip/TipSkeleton";
import { Postwall } from "@/app/features/profile/feed/Postwall/Postwall";
import { PostwallSkeleton } from "@/app/features/profile/feed/Postwall/PostwallSkeleton";
import { SuggestedFriends } from "@/app/features/friends/SuggestedFriends/SuggestedFriends";
import { SuggestedFriendsSkeleton } from "@/app/features/friends/SuggestedFriends/SuggestedFriendsSkeleton";
import { getFeed } from "@/services/api/post";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { useFeedStore } from "@/app/hooks/feed/useFeedStore";
import { useSuggestedFriendsStore } from "@/app/hooks/friends/useSuggestedFriendsStore";
import { loadSuggestions } from "@/app/hooks/friends/useSuggestedFriends";
import styles from "./FeedLayout.module.scss";

export const FeedLayout = () => {
  const t = useTranslations();
  const posts = useFeedStore((state) => state.posts);
  const postsLoaded = useFeedStore((state) => state.hasLoaded);
  const setPosts = useFeedStore((state) => state.setPosts);
  const suggestionsLoaded = useSuggestedFriendsStore(
    (state) => state.hasLoaded,
  );
  const setSuggestions = useSuggestedFriendsStore(
    (state) => state.setSuggestions,
  );
  const currentUser = useAuthStore((state) => state.currentUser);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);
  const currentUsername = currentUser?.username;

  const pageReady = isAuthChecked && postsLoaded && suggestionsLoaded;

  useEffect(() => {
    if (!currentUsername) return;

    const needSuggestions = !useSuggestedFriendsStore.getState().hasLoaded;
    let cancelled = false;

    Promise.all([
      getFeed(currentUsername).catch(() => null),
      needSuggestions
        ? loadSuggestions(currentUsername).catch(() => null)
        : null,
    ]).then(([newPosts, newSuggestions]) => {
      if (cancelled) return;
      if (newPosts) {
        setPosts(newPosts);
      } else {
        toast.error(t("toasts.error"));
        if (!useFeedStore.getState().hasLoaded) setPosts([]);
      }

      if (needSuggestions) setSuggestions(newSuggestions ?? []);
    });

    return () => {
      cancelled = true;
    };
  }, [currentUsername, setPosts, setSuggestions, t]);

  const refreshPosts = () => {
    if (!currentUsername) return;
    getFeed(currentUsername)
      .then(setPosts)
      .catch(() => toast.error(t("toasts.error")));
  };

  if (!pageReady) {
    return (
      <div className={styles.layout}>
        <div className={styles.content}>
          <PostwallSkeleton />
        </div>
        <div className={styles.rightColumn}>
          <SuggestedFriendsSkeleton />
          <TipSkeleton
            title={t("common.didYouKnow")}
            text={t("feedTip.text")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <Postwall
          posts={posts}
          onRefresh={refreshPosts}
          emptyTitle={t("feed.friendsEmptyTitle")}
          emptyText={t("feed.friendsEmptyText")}
        />
      </div>
      <div className={styles.rightColumn}>
        <SuggestedFriends />
        <Tip title={t("common.didYouKnow")} text={t("feedTip.text")} />
      </div>
    </div>
  );
};
