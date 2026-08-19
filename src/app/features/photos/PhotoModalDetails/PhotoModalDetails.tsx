import cn from "classnames";
import { useLocale, useTranslations } from "next-intl";
import { Comment as CommentType, Photo } from "@/types";
import { Button } from "@/app/uikit/form/Button/Button";
import { LikeButton } from "@/app/uikit/feedback/LikeButton/LikeButton";
import { FaReply } from "react-icons/fa";
import { Comment } from "../../profile/feed/Comment/Comment";
import { CommentCreator } from "../../profile/feed/CommentCreator/CommentCreator";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { DropdownMenu } from "@/app/uikit/overlays/DropdownMenu/DropdownMenu";
import { MdDeleteSweep } from "react-icons/md";
import { formatDate } from "@/utils/dateFormatters";
import styles from "./PhotoModalDetails.module.scss";

interface PhotoModalDetailsProps {
  photo: Photo;
  avatar?: string;
  name: string;
  isOwner?: boolean;
  onDeleteRequest: () => void;
  liked: boolean;
  displayCount: number | null;
  likeLoading: boolean;
  onToggleLike: () => void;
  comments: CommentType[];
  onDeleteComment: (commentId: string) => void;
  postId?: string;
  onCommentSuccess: () => void;
}

export const PhotoModalDetails = ({
  photo,
  avatar,
  name,
  isOwner,
  onDeleteRequest,
  liked,
  displayCount,
  likeLoading,
  onToggleLike,
  comments,
  onDeleteComment,
  postId,
  onCommentSuccess,
}: PhotoModalDetailsProps) => {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className={styles.details}>
      <div className={styles.detailsWrapper}>
        <div className={styles.author}>
          <div className={styles.avatar}>
            <Avatar src={avatar} />
          </div>
          <div className={styles.info}>
            <div className={styles.name}>{name}</div>
            <time className={styles.time}>
              {formatDate(photo.createdAt, locale)}
            </time>
          </div>
          {isOwner && (
            <div className={styles.dropdown}>
              <DropdownMenu
                items={[
                  {
                    label: t("common.delete"),
                    icon: <MdDeleteSweep size={20} />,
                    onClick: onDeleteRequest,
                  },
                ]}
              />
            </div>
          )}
        </div>
        <div className={styles.stats}>
          <LikeButton
            liked={liked}
            count={displayCount}
            loading={likeLoading}
            onToggle={onToggleLike}
            className={styles.stat}
          />
          <Button
            appearance="ghost"
            className={cn(styles.stat, styles.statRepost)}
          >
            <FaReply size={18} />
            <span>{photo.reposts ?? ""}</span>
          </Button>
        </div>
      </div>
      <ul className={styles.comments}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <li key={comment.id}>
              <Comment
                comment={comment}
                onDelete={() => onDeleteComment(comment.id)}
              />
            </li>
          ))
        ) : (
          <div className={styles.emptyComments}>
            <p className={styles.title}>{t("photoModal.commentsTitle")}</p>
            <p className={styles.text}>{t("photoModal.commentsText")}</p>
          </div>
        )}
      </ul>
      <div className={styles.detailsFooter}>
        <CommentCreator
          postId={postId}
          photoId={postId ? undefined : photo.id}
          onSuccess={onCommentSuccess}
        />
      </div>
    </div>
  );
};
