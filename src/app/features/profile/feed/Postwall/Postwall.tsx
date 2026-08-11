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
}

export const Postwall = ({ posts, loading, onRefresh }: PostwallProps) => {
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
        <EmptyState compact title={t("feed.title")} text={t("feed.text")} />
      )}
    </div>
  );
};