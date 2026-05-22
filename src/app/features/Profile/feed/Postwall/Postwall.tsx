"use client";

import { Post } from "@/app/features/profile/feed/Post/Post";
import styles from "./Postwall.module.scss";
import { useTranslations } from "next-intl";
import { Post as PostType} from "@/types";

const SKELETON_ITEMS = [1, 2, 3];

interface PostwallProps {
  posts: PostType[];
  loading?: boolean;
  onRefresh: () => void;
}

export const Postwall = ({ posts, loading, onRefresh }: PostwallProps) => {
  const t = useTranslations();

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeleton}>
          {SKELETON_ITEMS.map((i) => (
            <div key={i} className={styles.skeletonPost} />
          ))}
        </div>
      </div>
    );
  }

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
