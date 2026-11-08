"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { PhotoModal } from "@/app/features/photos/PhotoModal/PhotoModal";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { repostPhoto } from "@/services/api/post";
import { getPhotoUrl } from "@/utils/photo";
import { Post as PostType, SharedPhoto } from "@/types";
import { PostHeader } from "../PostHeader/PostHeader";
import styles from "../Post/Post.module.scss";

interface PhotoRepostProps {
  post: PostType;
  photo: SharedPhoto;
  onRefresh: () => void;
}

export const PhotoRepost = ({ post, photo, onRefresh }: PhotoRepostProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const currentUser = useAuthStore((state) => state.currentUser);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [isUndoOpen, setIsUndoOpen] = useState(false);

  const isRepostOwner = currentUser?.username === post.repostedBy?.username;
  const author = {
    name: photo.user.name || photo.user.username,
    username: photo.user.username,
    avatar: photo.user.avatar,
  };

  const undoRepost = async () => {
    try {
      await repostPhoto(photo.id);
      setIsUndoOpen(false);
      onRefresh();
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  return (
    <article>
      <PostHeader
        author={post.repostedBy ?? author}
        date={post.repostedAt ?? photo.createdAt}
        locale={locale}
        deleteLabel={t("post.undoRepost")}
        onDelete={isRepostOwner ? () => setIsUndoOpen(true) : undefined}
      />

      <PostHeader
        author={author}
        date={photo.createdAt}
        locale={locale}
        size="compact"
      />

      <div className={styles.contentWrapper}>
        <button
          type="button"
          className={styles.mediaContent}
          onClick={() => setIsPhotoOpen(true)}
        >
          <Image
            src={getPhotoUrl(photo)}
            alt={t("post.image")}
            fill
            sizes="(max-width: 768px) 100vw, 700px"
          />
        </button>
      </div>

      <PhotoModal
        photo={isPhotoOpen ? photo : null}
        author={author}
        onClose={() => setIsPhotoOpen(false)}
        enableRepost
      />

      <ConfirmModal
        isOpen={isUndoOpen}
        title={t("post.undoRepostModalTitle")}
        description={t("post.undoRepostModalDescription")}
        confirmLabel={t("post.undoRepost")}
        onConfirm={undoRepost}
        onClose={() => setIsUndoOpen(false)}
      />
    </article>
  );
};
