import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import styles from "./CommentCreator.module.scss";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { createComment } from "@/app/api/comment";
import { StaticImageData } from "next/image";
import { SubmitTextarea } from "@/app/uikit/form/SubmitTextarea/SumbitTextarea";

interface CommentCreatorProps {
  postId?: string;
  photoId?: string;
  avatar?: string | StaticImageData;
  onSuccess?: () => void;
}

export const CommentCreator = ({
  postId,
  photoId,
  avatar,
  onSuccess,
}: CommentCreatorProps) => {
  const t = useTranslations();
  const [content, setContent] = useState("");

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
          <Avatar size={38} src={avatar} />
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
