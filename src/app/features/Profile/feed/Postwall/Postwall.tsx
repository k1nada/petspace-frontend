"use client";

import { Post } from "@/app/features/profile/feed/Post/Post";
import styles from "./Postwall.module.scss";
import { useTranslations } from "next-intl";
import { Post as PostType } from "@/types";
import { PostwallSkeleton } from "./PostwallSkeleton";

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
        <div className={styles.emptyFeed}>
          <p className={styles.emptyTitle}>{t("feed.title")}</p>
          <p className={styles.emptyText}>{t("feed.text")}</p>
        </div>
      )}
    </div>
  );
};