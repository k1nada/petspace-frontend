import styles from "./PostCreator.module.scss";
import { Button } from "@/app/uikit/form/Button/Button";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { FaCamera, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { ROUTES } from "@/routes/routes";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { createPost } from "@/app/api/post";
import { Textarea } from "@/app/uikit/form/Textarea/Textarea";
import { useTextareaSubmit } from "@/app/hooks/useTextareaSubmit";

interface PostCreatorProps {
  avatar?: string;
  username: string;
  name: string;
  postwallId: string;
  onSuccess?: () => void;
}

export const PostCreator = ({
  avatar,
  username,
  name,
  postwallId,
  onSuccess,
}: PostCreatorProps) => {
  const t = useTranslations();
  const [content, setContent] = useState("");

  const publishPost = async () => {
    if (!content) return;
    await createPost(content, postwallId);
    setContent("");
    onSuccess?.();
  };

  const { handleKeyDown } = useTextareaSubmit({ onSubmit: publishPost });

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Avatar src={avatar} />
        <div className={styles.textareaWrapper}>
          <Textarea
            appearance="secondary"
            value={content}
            onKeyDown={handleKeyDown}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("postCreator.placeholder") + name + "?"}
          />
        </div>
      </div>
      <div className={styles.actions}>
        <div className={styles.attachments}>
          <Link
            href={ROUTES.photos(username)}
            className={styles.attachmentItem}
          >
            <FaCamera size={16} />
            {t("postCreator.photo")}
          </Link>
          <Link href={ROUTES.places} className={styles.attachmentItem}>
            <FaMapMarkerAlt size={16} />
            {t("postCreator.place")}
          </Link>
        </div>
        <Button appearance="primary" onClick={publishPost}>
          {t("postCreator.publish")}
        </Button>
      </div>
    </div>
  );
};
