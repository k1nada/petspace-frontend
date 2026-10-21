"use client";

import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import styles from "./CommentCreator.module.scss";
import { Ref, useState } from "react";
import { useTranslations } from "next-intl";
import { createComment } from "@/services/api/comment";
import { SubmitTextarea } from "@/app/uikit/form/SubmitTextarea/SubmitTextarea";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { toast } from "react-toastify";

interface CommentCreatorProps {
  postId?: string;
  photoId?: string;
  replyCommentId?: string;
  initialContent?: string;
  onSuccess?: () => void;
  textareaRef?: Ref<HTMLTextAreaElement>;
  autoFocus?: boolean;
}

export const CommentCreator = ({
  postId,
  photoId,
  replyCommentId,
  initialContent,
  onSuccess,
  textareaRef,
  autoFocus,
}: CommentCreatorProps) => {
  const t = useTranslations();
  const [content, setContent] = useState(initialContent ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = useAuthStore((state) => state.currentUser);

  const handleSubmit = async () => {
    const trimmedContent = content.trim();
    if (!trimmedContent || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await createComment(trimmedContent, postId, photoId, replyCommentId);
      setContent("");
      onSuccess?.();
    } catch {
      toast.error(t("toasts.commentPostError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.avatarWrapper}>
          <Avatar size={38} src={currentUser?.avatar} />
        </div>
        <SubmitTextarea
          value={content}
          onChange={setContent}
          onSubmit={handleSubmit}
          placeholder={t("commentCreator.placeholder")}
          maxLength={1000}
          disabled={isSubmitting}
          textareaRef={textareaRef}
          autoFocus={autoFocus}
        />
      </div>
    </div>
  );
};
