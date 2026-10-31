"use client";

import cn from "classnames";
import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./ChatMessage.module.scss";
import { SharedPhoto, SharedPost } from "@/types";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { Button } from "@/app/uikit/form/Button/Button";
import { ROUTES } from "@/routes/routes";
import { getPhotoUrl } from "@/utils/photo";

interface ChatMessageProps {
  text: string;
  time: string;
  isOwn?: boolean;
  post?: SharedPost | null;
  photo?: SharedPhoto | null;
  status?: "sending" | "failed";
  isGroupStart?: boolean;
  isGroupEnd?: boolean;
  onRetry?: () => void;
  onOpenPhoto?: () => void;
}

export const ChatMessage = ({
  text,
  time,
  isOwn,
  post,
  photo,
  status,
  isGroupStart = true,
  isGroupEnd = true,
  onRetry,
  onOpenPhoto,
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
        <div
          className={cn(styles.bubble, { [styles.postBubble]: post || photo })}
        >
          {photo && (
            <div className={styles.postCard}>
              <Link
                href={ROUTES.profile(photo.user.username)}
                className={styles.postAuthor}
              >
                {photo.user.name || photo.user.username}
              </Link>
              <button
                type="button"
                className={cn(styles.postImage, styles.photoButton)}
                onClick={onOpenPhoto}
              >
                <Image
                  src={getPhotoUrl(photo)}
                  alt={t("photoGallery.photoAlt", {
                    name: photo.user.name || photo.user.username,
                  })}
                  fill
                  sizes="240px"
                />
              </button>
            </div>
          )}
          {!photo && post && (
            <div className={styles.postCard}>
              <Link
                href={ROUTES.profile(post.user.username)}
                className={styles.postAuthor}
              >
                {post.user.name || post.user.username}
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
          )}
          {!photo && !post && (
            <span className={styles.text}>
              {text || t("chat.deletedContent")}
            </span>
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
