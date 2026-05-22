import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import styles from "./Comment.module.scss";
import { FaHeart } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { Button } from "@/app/uikit/form/Button/Button";
import { useLocale, useTranslations } from "next-intl";
import dayjs from "dayjs";
import "dayjs/locale/pl";
import "dayjs/locale/en";
import { likeComment } from "@/app/api/likes";
import { useLike } from "@/app/hooks/useLike";
import { Comment as CommentType} from "@/types";

interface CommentProps {
  comment: CommentType;
  onDelete: () => void;
}

export const Comment = ({ comment, onDelete }: CommentProps) => {
  const t = useTranslations();
  const locale = useLocale();

  const { liked, displayCount, likeLoading, handleLike } = useLike({
    initialLiked: comment.liked,
    initialCount: comment.likesCount,
    onLike: likeComment,
    id: comment.id,
  });

  return (
    <article className={styles.container}>
      <Avatar size={38} src={comment.user.avatar} />
      <div className={styles.info}>
        <div className={styles.header}>
          <div className={styles.name}>{comment.user.name}</div>
          <time className={styles.time}>
            {dayjs(comment.createdAt).locale(locale).format("D MMM YYYY")}
          </time>
        </div>
        <div className={styles.content}>{comment.content}</div>
        <div className={styles.footer}>
          <div className={styles.reply}>{t("comment.reply")}</div>
          <Button
            appearance="ghost"
            className={`${styles.likes} ${liked ? styles.liked : ""}`}
            onClick={handleLike}
            disabled={likeLoading}
          >
            <FaHeart size={14} />
            <span>{displayCount}</span>
          </Button>
        </div>
      </div>
      <div className={styles.delete}>
        <Button
          appearance="ghost"
          className={styles.deleteButton}
          onClick={onDelete}
        >
          <IoCloseSharp size={20} />
        </Button>
      </div>
    </article>
  );
};
