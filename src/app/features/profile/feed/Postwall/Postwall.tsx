"use client";

import { Post } from "@/app/features/profile/feed/Post/Post";
import styles from "./Postwall.module.scss";
import { useTranslations } from "next-intl";
import { Post as PostType } from "@/types";
import { PostwallSkeleton } from "./PostwallSkeleton";
import { EmptyState } from "@/app/uikit/feedback/EmptyState/EmptyState";

interface PostwallProps {
  posts: PostType[];
  loading?: boolean;
  onRefresh: () => void;
  emptyTitle?: string;
  emptyText?: string;
}

export const Postwall = ({
  posts,
  loading,
  onRefresh,
  emptyTitle,
  emptyText,
}: PostwallProps) => {
  const t = useTranslations();

  if (loading) return <PostwallSkeleton />;

  return (
    <div className={styles.container}>
      {posts.length > 0 ? (
        <ul className={styles.list}>
          {posts.map((post) => (
            <li key={post.id}>
              <Post post={post} onRefresh={onRefresh} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          compact
          title={emptyTitle ?? t("feed.title")}
          text={emptyText ?? t("feed.text")}
        />
      )}
    </div>
  );
};