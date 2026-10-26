"use client";

import styles from "./Post.module.scss";
import Image from "next/image";
import { FaReply } from "react-icons/fa";
import { Photo, Post as PostType, PostChanges, RepostState } from "@/types";
import { Comment } from "@/app/features/profile/feed/Comment/Comment";
import { CommentCreator } from "../CommentCreator/CommentCreator";
import { SharePostModal } from "../SharePostModal/SharePostModal";
import { PhotoModal } from "@/app/features/photos/PhotoModal/PhotoModal";
import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "react-toastify";
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
import { useFeedStore } from "@/app/hooks/feed/useFeedStore";
import { useProfilePostsStore } from "@/app/hooks/profile/useProfilePostsStore";

interface PostProps {
  post: PostType;
  onRefresh: () => void;
}

export const Post = ({ post, onRefresh }: PostProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const currentUser = useAuthStore((state) => state.currentUser);
  const isOwner = currentUser?.username === post.user.username;
  const isRepostOwner = currentUser?.username === post.repostedBy?.username;
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const updatePostInStores = (changes: PostChanges) => {
    useFeedStore.getState().updatePost(post.id, changes);
    useProfilePostsStore.getState().updatePost(post.id, changes);
  };

  const { liked, displayCount, likeLoading, toggleLike } = useLike({
    initialLiked: post.liked,
    initialCount: post.likesCount,
    onLike: likePost,
    id: post.id,
    onChange: (newLiked, count) =>
      updatePostInStores({ liked: newLiked, likesCount: count }),
  });

  const { reposted, repostCount, repostLoading, handleToggleRepost } =
    usePostRepost({
      postId: post.id,
      initialReposted: post.reposted ?? false,
      initialCount: post.reposts ?? 0,
      onChange: (newReposted, count) =>
        updatePostInStores({ reposted: newReposted, reposts: count }),
    });

  const commentCount = post.comments?.length ?? 0;

  const {
    isInputShown,
    setIsInputShown,
    replyTo,
    rootComments,
    repliesFor,
    replyComment,
    deleteComment,
    editComment,
    onCommentCreated,
  } = usePostComments({
    comments: post.comments ?? [],
    onRefresh,
  });

  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const isInputVisible = commentCount > 0 || isInputShown;

  const showCommentInput = () => {
    if (commentInputRef.current) {
      commentInputRef.current.focus();
      return;
    }
    setIsInputShown(true);
  };

  const photoData: Photo = {
    id: post.id,
    publicId: "",
    createdAt: post.createdAt,
    likesCount: post.likesCount,
    liked: post.liked,
    comments: post.comments,
  };
  const postPhoto: Photo | null = post.image ? photoData : null;

  const repostState: RepostState = {
    reposted,
    count: repostCount,
    loading: repostLoading,
    onToggle: () => setIsShareOpen(true),
  };

  const handleStartEditPost = () => {
    setEditContent(post.content);
    setIsEditing(true);
  };

  const handleSaveEditPost = async () => {
    const trimmedContent = editContent.trim();
    if (!trimmedContent || isSavingEdit) return;
    setIsSavingEdit(true);
    try {
      await updatePost(post.id, trimmedContent);
      updatePostInStores({ content: trimmedContent });
      setIsEditing(false);
    } catch {
      toast.error(t("toasts.postSaveError"));
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeletePost = async () => {
    if (isOwner) {
      try {
        await deletePost(post.id);
        onRefresh();
      } catch {
        toast.error(t("toasts.postDeleteError"));
      }
      return;
    }

    if (isRepostOwner) {
      await handleToggleRepost();
      onRefresh();
    }
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
        showActions={(isOwner || isRepostOwner) && !isEditing}
        canEdit={isOwner}
        onEdit={handleStartEditPost}
        onDelete={() => setIsDeleteOpen(true)}
      />

      <div className={styles.contentWrapper}>
        {isEditing ? (
          <PostEditForm
            content={editContent}
            originalContent={post.content}
            isSaving={isSavingEdit}
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
            <Image
              src={post.image}
              alt={t("post.image")}
              fill
              sizes="(max-width: 768px) 100vw, 700px"
            />
          </button>
        )}
      </div>

      {!isEditing && (
        <>
          <PostStats
            liked={liked}
            likeCount={displayCount}
            likeLoading={likeLoading}
            onToggleLike={toggleLike}
            commentCount={commentCount}
            onToggleComments={showCommentInput}
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

          {isInputVisible && (
            <CommentCreator
              textareaRef={commentInputRef}
              autoFocus={isInputShown}
              key={replyTo ? replyTo.commentId : "root"}
              postId={post.id}
              replyCommentId={replyTo?.commentId}
              initialContent={replyTo ? `${replyTo.name}, ` : undefined}
              onSuccess={onCommentCreated}
            />
          )}
        </>
      )}

      <ConfirmModal
        isOpen={isDeleteOpen}
        title={t("post.modalTitle")}
        description={t("common.cannotUndo")}
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
