"use client";

import { Post } from "@/app/features/profile/feed/Post/Post";
import styles from "./Postwall.module.scss";
import { useTranslations } from "next-intl";
import { Post as PostType } from "@/types";
import { EmptyState } from "@/app/uikit/feedback/EmptyState/EmptyState";
import { Card } from "@/app/uikit/layout/Card/Card";

interface PostwallProps {
  posts: PostType[];
  onRefresh: () => void;
  emptyTitle?: string;
  emptyText?: string;
}

export const Postwall = ({
  posts,
  onRefresh,
  emptyTitle,
  emptyText,
}: PostwallProps) => {
  const t = useTranslations();

  return (
    <Card>
      {posts.length > 0 ? (
        <ul className={styles.list}>
          {posts.map((post) => (
            <li
              key={
                post.repostedBy
                  ? `${post.id}-${post.repostedBy.username}`
                  : post.id
              }
            >
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
    </Card>
  );
};
