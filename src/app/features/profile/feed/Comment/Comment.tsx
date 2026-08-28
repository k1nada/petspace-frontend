import styles from "./Comment.module.scss";
import cn from "classnames";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { Button } from "@/app/uikit/form/Button/Button";
import { Textarea } from "@/app/uikit/form/Textarea/Textarea";
import { LikeButton } from "@/app/uikit/feedback/LikeButton/LikeButton";
import { DropdownMenu } from "@/app/uikit/overlays/DropdownMenu/DropdownMenu";
import { MdDeleteSweep, MdModeEdit } from "react-icons/md";
import { useLocale, useTranslations } from "next-intl";
import { likeComment } from "@/app/api/likes";
import { useLike } from "@/app/hooks/shared/useLike";
import { Comment as CommentType } from "@/types";
import { ROUTES } from "@/routes/routes";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { formatDate } from "@/utils/dateFormatters";
import { useState } from "react";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";

interface CommentProps {
  comment: CommentType;
  replies?: CommentType[];
  postId?: string;
  photoId?: string;
  avatarSize?: number;
  onDelete: () => void;
  onEdit: (content: string) => void;
  onDeleteReply?: (commentId: string) => void;
  onEditReply?: (commentId: string, content: string) => void;
  onReply?: (commentId: string, name: string) => void;
}

export const Comment = ({
  comment,
  replies,
  postId,
  photoId,
  avatarSize = 38,
  onDelete,
  onEdit,
  onDeleteReply,
  onEditReply,
  onReply,
}: CommentProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const currentUser = useAuthStore((state) => state.currentUser);
  const isOwner = currentUser?.username === comment.user.username;
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isHovered, setIsHovered] = useState(false);

  const { liked, displayCount, likeLoading, toggleLike } = useLike({
    initialLiked: comment.liked,
    initialCount: comment.likesCount,
    onLike: likeComment,
    id: comment.id,
  });

  const handleDeleteComment = () => {
    onDelete();
    setIsDeleteOpen(false);
  };

  const handleStartEditComment = () => {
    setEditContent(comment.content);
    setIsEditing(true);
  };

  const handleSaveEditComment = () => {
    const trimmedContent = editContent.trim();
    if (!trimmedContent) return;
    onEdit(trimmedContent);
    setIsEditing(false);
  };

  return (
    <article
      className={styles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={ROUTES.profile(comment.user.username)}>
        <Avatar size={avatarSize} src={comment.user.avatar} />
      </Link>
      <div className={styles.info}>
        <div className={styles.header}>
          <Link href={ROUTES.profile(comment.user.username)}>
            <div className={styles.name}>{comment.user.name}</div>
          </Link>
          <time className={styles.time}>
            {formatDate(comment.createdAt, locale)}
          </time>
        </div>
        {isEditing ? (
          <div className={styles.editWrapper}>
            <Textarea
              appearance="secondary"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              autoFocus
            />
            <div className={styles.editActions}>
              <Button
                appearance="secondary"
                onClick={() => setIsEditing(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button
                appearance="primary"
                onClick={handleSaveEditComment}
                disabled={!editContent.trim()}
              >
                {t("common.save")}
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.content}>{comment.content}</div>
        )}
        {!isEditing && (
          <div className={styles.footer}>
            {onReply && (
              <Button
                appearance="ghost"
                className={styles.reply}
                onClick={() => onReply(comment.id, comment.user.name)}
              >
                {t("comment.reply")}
              </Button>
            )}
            <LikeButton
              liked={liked}
              count={displayCount}
              loading={likeLoading}
              onToggle={toggleLike}
              className={styles.likes}
            />
          </div>
        )}
      </div>
      {isOwner && !isEditing && (
        <div className={cn(styles.dropdown, { [styles.visible]: isHovered })}>
          <DropdownMenu
            items={[
              {
                label: t("common.edit"),
                icon: <MdModeEdit size={20} />,
                onClick: handleStartEditComment,
              },
              {
                label: t("common.delete"),
                icon: <MdDeleteSweep size={20} />,
                onClick: () => setIsDeleteOpen(true),
              },
            ]}
          />
        </div>
      )}

      {replies && replies.length > 0 && (
        <ul className={styles.replies}>
          {replies.map((reply) => (
            <li key={reply.id}>
              <Comment
                comment={reply}
                postId={postId}
                photoId={photoId}
                avatarSize={28}
                onDelete={() => onDeleteReply?.(reply.id)}
                onEdit={(content) => onEditReply?.(reply.id, content)}
                onReply={onReply}
              />
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        isOpen={isDeleteOpen}
        title={t("comment.deleteModalTitle")}
        description={t("comment.deleteModalDescription")}
        onConfirm={handleDeleteComment}
        onClose={() => setIsDeleteOpen(false)}
      />
    </article>
  );
};
