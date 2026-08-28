import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import styles from "./CommentCreator.module.scss";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { createComment } from "@/app/api/comment";
import { SubmitTextarea } from "@/app/uikit/form/SubmitTextarea/SubmitTextarea";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { toast } from "react-toastify";

interface CommentCreatorProps {
  postId?: string;
  photoId?: string;
  replyCommentId?: string;
  initialContent?: string;
  onSuccess?: () => void;
}

export const CommentCreator = ({
  postId,
  photoId,
  replyCommentId,
  initialContent,
  onSuccess,
}: CommentCreatorProps) => {
  const t = useTranslations();
  const [content, setContent] = useState(initialContent ?? "");
  const currentUser = useAuthStore((state) => state.currentUser);

  const handleSubmit = async () => {
    if (!content) return;
    const comment = await createComment(content, postId, photoId, replyCommentId);
    if (!comment) {
      toast.error(t("toasts.error"));
      return;
    }
    setContent("");
    onSuccess?.();
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
        />
      </div>
    </div>
  );
};
