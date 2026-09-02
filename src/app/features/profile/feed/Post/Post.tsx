"use client";

import styles from "./Post.module.scss";
import Image from "next/image";
import { FaReply } from "react-icons/fa";
import { Photo, Post as PostType, RepostState } from "@/types";
import { Comment } from "@/app/features/profile/feed/Comment/Comment";
import { CommentCreator } from "../CommentCreator/CommentCreator";
import { SharePostModal } from "../SharePostModal/SharePostModal";
import { PhotoModal } from "@/app/features/photos/PhotoModal/PhotoModal";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { likePost } from "@/services/api/likes";
import { deletePost, updatePost } from "@/services/api/post";
import { useLike } from "@/app/hooks/shared/useLike";
import { PostHeader } from "../PostHeader/PostHeader";
import { PostEditForm } from "../PostEditForm/PostEditForm";
import { PostStats } from "../PostStats/PostStats";
import { usePostRepost } from "@/app/hooks/posts/usePostRepost";
import { usePostComments } from "@/app/hooks/posts/usePostComments";
import { ROUTES } from "@/routes/routes";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";

export interface PostProps {
  post: PostType;
  onRefresh: () => void;
}

export const Post = ({ post, onRefresh }: PostProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const currentUser = useAuthStore((state) => state.currentUser);
  const isOwner = currentUser?.username === post.user.username;
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const { liked, displayCount, likeLoading, toggleLike } = useLike({
    initialLiked: post.liked,
    initialCount: post.likesCount,
    onLike: likePost,
    id: post.id,
  });

  const { reposted, repostCount, repostLoading, handleToggleRepost } =
    usePostRepost({
      postId: post.id,
      initialReposted: post.reposted ? true : false,
      initialCount: post.reposts ? post.reposts : 0,
    });

  const commentCount = post.comments ? post.comments.length : 0;

  const {
    showCommentCreator,
    setShowCommentCreator,
    replyTo,
    rootComments,
    repliesFor,
    replyComment,
    deleteComment,
    editComment,
    onCommentCreated,
  } = usePostComments({
    comments: post.comments ?? [],
    hasComments: commentCount > 0,
    onRefresh,
  });

  const photoData: Photo = {
    id: post.id,
    publicId: "",
    createdAt: new Date(post.createdAt).toISOString(),
    likesCount: post.likesCount,
    liked: post.liked,
    comments: post.comments,
  };
  const postPhoto: Photo | null = post.image ? photoData : null;

  const repostData: RepostState = {
    reposted,
    count: repostCount,
    loading: repostLoading,
    onToggle: handleToggleRepost,
  };
  const repostState: RepostState | undefined = isOwner ? undefined : repostData;

  const handleStartEditPost = () => {
    setEditContent(post.content);
    setIsEditing(true);
  };

  const handleSaveEditPost = async () => {
    const trimmedContent = editContent.trim();
    if (!trimmedContent) return;
    await updatePost(post.id, trimmedContent);
    setIsEditing(false);
    onRefresh();
  };

  const handleDeletePost = async () => {
    await deletePost(post.id);
    onRefresh();
  };

  return (
    <article>
      {post.repostedBy && (
        <Link
          href={ROUTES.profile(post.repostedBy.username)}
          className={styles.repostedBy}
        >
          <FaReply size={16} />
          <span>{t("post.repostedBy", { name: post.repostedBy.name })}</span>
        </Link>
      )}

      <PostHeader
        post={post}
        locale={locale}
        showActions={isOwner && !isEditing}
        onEdit={handleStartEditPost}
        onDelete={() => setIsDeleteOpen(true)}
      />

      <div className={styles.contentWrapper}>
        {isEditing ? (
          <PostEditForm
            content={editContent}
            onChange={setEditContent}
            onCancel={() => setIsEditing(false)}
            onSave={handleSaveEditPost}
          />
        ) : (
          <div className={styles.content}>{post.content}</div>
        )}

        {post.image && (
          <button
            type="button"
            className={styles.mediaContent}
            onClick={() => setIsPhotoOpen(true)}
          >
            <Image src={post.image} alt={t("post.image")} fill />
          </button>
        )}
      </div>

      <PostStats
        liked={liked}
        likeCount={displayCount}
        likeLoading={likeLoading}
        onToggleLike={toggleLike}
        commentCount={commentCount}
        onToggleComments={() => setShowCommentCreator((prev) => !prev)}
        reposted={reposted}
        repostCount={repostCount}
        onOpenShare={() => setIsShareOpen(true)}
      />

      <ul className={styles.comments}>
        {rootComments.map((comment) => (
          <li key={comment.id}>
            <Comment
              comment={comment}
              replies={repliesFor(comment.id)}
              postId={post.id}
              onDelete={() => deleteComment(comment.id)}
              onEdit={(content) => editComment(comment.id, content)}
              onDeleteReply={deleteComment}
              onEditReply={editComment}
              onReply={replyComment}
            />
          </li>
        ))}
      </ul>

      {showCommentCreator && (
        <CommentCreator
          key={replyTo ? replyTo.commentId : "root"}
          postId={post.id}
          replyCommentId={replyTo?.commentId}
          initialContent={replyTo ? `${replyTo.name}, ` : undefined}
          onSuccess={onCommentCreated}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteOpen}
        title={t("post.modalTitle")}
        description={t("post.modalDescription")}
        onConfirm={handleDeletePost}
        onClose={() => setIsDeleteOpen(false)}
      />

      <PhotoModal
        photo={isPhotoOpen ? postPhoto : null}
        imageUrl={post.image}
        postId={post.id}
        author={{
          avatar: post.user.avatar,
          name: post.user.name,
          username: post.user.username,
        }}
        onClose={() => setIsPhotoOpen(false)}
        likeState={{ liked, displayCount, likeLoading, onToggle: toggleLike }}
        repostState={repostState}
        onCommentsRefresh={onRefresh}
      />

      <SharePostModal
        isOpen={isShareOpen}
        postId={post.id}
        isOwner={isOwner}
        onClose={() => setIsShareOpen(false)}
        onShareToWall={handleToggleRepost}
      />
    </article>
  );
};
