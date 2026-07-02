import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import styles from "./CommentCreator.module.scss";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { createComment } from "@/app/api/comment";
import { SubmitTextarea } from "@/app/uikit/form/SubmitTextarea/SumbitTextarea";
import { useUserStore } from "@/app/hooks/useUserStore";

interface CommentCreatorProps {
  postId?: string;
  photoId?: string;
  onSuccess?: () => void;
}

export const CommentCreator = ({
  postId,
  photoId,
  onSuccess,
}: CommentCreatorProps) => {
  const t = useTranslations();
  const [content, setContent] = useState("");
  const currentUser = useUserStore((state) => state.currentUser);

  const handleSubmit = async () => {
    if (!content) return;
    await createComment(content, postId, photoId);
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
