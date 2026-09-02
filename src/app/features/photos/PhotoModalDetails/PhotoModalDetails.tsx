"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Photo, RepostState } from "@/types";
import { LikeButton } from "@/app/uikit/feedback/LikeButton/LikeButton";
import { RepostButton } from "@/app/uikit/feedback/RepostButton/RepostButton";
import { usePhotoComments } from "@/app/hooks/photos/usePhotoComments";
import { useResolvedLike, LikeState } from "@/app/hooks/photos/useResolvedLike";
import { Comment } from "../../profile/feed/Comment/Comment";
import { CommentCreator } from "../../profile/feed/CommentCreator/CommentCreator";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { DropdownMenu } from "@/app/uikit/overlays/DropdownMenu/DropdownMenu";
import { MdDeleteSweep } from "react-icons/md";
import { formatDate } from "@/utils/dateFormatters";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { ROUTES } from "@/routes/routes";
import styles from "./PhotoModalDetails.module.scss";

interface PhotoModalDetailsProps {
  photo: Photo;
  avatar?: string;
  name: string;
  username?: string;
  isOwner?: boolean;
  onDeleteRequest: () => void;
  likeState?: LikeState;
  onLikeChange?: (photoId: string, liked: boolean, likesCount: number) => void;
  repostState?: RepostState;
  postId?: string;
  onCommentsRefresh?: () => void;
}

export const PhotoModalDetails = ({
  photo,
  avatar,
  name,
  username,
  isOwner,
  onDeleteRequest,
  likeState,
  onLikeChange,
  repostState,
  postId,
  onCommentsRefresh,
}: PhotoModalDetailsProps) => {
  const t = useTranslations();
  const locale = useLocale();

  const [replyTo, setReplyTo] = useState<{
    commentId: string;
    name: string;
  } | null>(null);

  const {
    comments,
    refreshComments,
    deleteComment: onDeleteComment,
    editComment: onEditComment,
  } = usePhotoComments({ photo, postId, onCommentsRefresh });

  const {
    liked,
    displayCount,
    likeLoading,
    toggleLike: onToggleLike,
  } = useResolvedLike({ photo, postId, likeState, onLikeChange });

  const rootComments = comments.filter((comment) => !comment.parent);
  const repliesFor = (commentId: string) =>
    comments.filter((comment) => comment.parent === commentId);
  const commentPhotoId = postId ? undefined : photo.id;

  const handleReply = (commentId: string, name: string) => {
    setReplyTo((prev) =>
      prev?.commentId === commentId ? null : { commentId, name },
    );
  };

  return (
    <div className={styles.details}>
      <div className={styles.detailsWrapper}>
        <div className={styles.author}>
          {username ? (
            <Link href={ROUTES.profile(username)} className={styles.avatar}>
              <Avatar src={avatar} />
            </Link>
          ) : (
            <div className={styles.avatar}>
              <Avatar src={avatar} />
            </div>
          )}
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
          {repostState && (
            <RepostButton
              reposted={repostState.reposted}
              count={repostState.count}
              loading={repostState.loading}
              onToggle={repostState.onToggle}
              className={styles.stat}
            />
          )}
        </div>
      </div>
      <ul className={styles.comments}>
        {rootComments.length > 0 ? (
          rootComments.map((comment) => (
            <li key={comment.id}>
              <Comment
                comment={comment}
                replies={repliesFor(comment.id)}
                postId={postId}
                photoId={commentPhotoId}
                onDelete={() => onDeleteComment(comment.id)}
                onEdit={(content) => onEditComment(comment.id, content)}
                onDeleteReply={onDeleteComment}
                onEditReply={onEditComment}
                onReply={handleReply}
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
          key={replyTo?.commentId ?? "root"}
          postId={postId}
          photoId={commentPhotoId}
          replyCommentId={replyTo?.commentId}
          initialContent={replyTo ? `${replyTo.name}, ` : undefined}
          onSuccess={() => {
            refreshComments();
            setReplyTo(null);
          }}
        />
      </div>
    </div>
  );
};
