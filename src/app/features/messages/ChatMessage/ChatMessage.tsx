"use client";

import cn from "classnames";
import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./ChatMessage.module.scss";
import { SharedPost } from "@/types";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { Button } from "@/app/uikit/form/Button/Button";
import { ROUTES } from "@/routes/routes";

interface ChatMessageProps {
  text: string;
  time: string;
  isOwn?: boolean;
  post?: SharedPost | null;
  status?: "sending" | "failed";
  isGroupStart?: boolean;
  isGroupEnd?: boolean;
  onRetry?: () => void;
}

export const ChatMessage = ({
  text,
  time,
  isOwn,
  post,
  status,
  isGroupStart = true,
  isGroupEnd = true,
  onRetry,
}: ChatMessageProps) => {
  const t = useTranslations();

  let meta: string | null = null;
  if (status === "sending") meta = t("chat.sending");
  else if (isGroupEnd && status !== "failed") meta = time;

  return (
    <li
      className={cn(styles.message, {
        [styles.own]: isOwn,
        [styles.groupStart]: isGroupStart,
        [styles.joinedTop]: !isGroupStart,
        [styles.joinedBottom]: !isGroupEnd,
        [styles.sending]: status === "sending",
      })}
    >
      <div className={styles.content}>
        <div className={cn(styles.bubble, { [styles.postBubble]: post })}>
          {post ? (
            <div className={styles.postCard}>
              <Link
                href={ROUTES.profile(post.user.username)}
                className={styles.postAuthor}
              >
                {post.user.name}
              </Link>
              {post.image && (
                <div className={styles.postImage}>
                  <Image
                    src={post.image}
                    alt={t("post.image")}
                    fill
                    sizes="240px"
                  />
                </div>
              )}
              {post.content && (
                <span className={styles.postContent}>{post.content}</span>
              )}
            </div>
          ) : (
            <span className={styles.text}>{text || t("chat.deletedPost")}</span>
          )}
          {meta && <span className={styles.meta}>{meta}</span>}
        </div>
        {status === "failed" && (
          <span className={styles.failed}>
            {t("chat.notSent")}
            <Button
              appearance="minimal"
              className={styles.retry}
              onClick={onRetry}
            >
              {t("chat.retry")}
            </Button>
          </span>
        )}
      </div>
    </li>
  );
};
