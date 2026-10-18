import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import {
  getPhotoComments,
  updateComment,
  deleteComment as deleteCommentApi,
} from "@/services/api/comment";
import { Comment as CommentType, Photo } from "@/types";

interface UsePhotoCommentsProps {
  photo: Photo | null;
  postId?: string;
  onCommentsRefresh?: () => void;
}

export const usePhotoComments = ({
  photo,
  postId,
  onCommentsRefresh,
}: UsePhotoCommentsProps) => {
  const t = useTranslations();
  const [commentsByPhotoId, setCommentsByPhotoId] = useState<
    Record<string, CommentType[]>
  >({});
  const photoId = photo?.id;
  const cachedComments = photoId ? commentsByPhotoId[photoId] : undefined;

  const commentsLoading = !postId && !cachedComments;
  let comments: CommentType[] = [];
  if (postId) comments = photo?.comments ?? [];
  else if (cachedComments) comments = cachedComments;

  const saveComments = (id: string, data: CommentType[]) => {
    setCommentsByPhotoId((prev) => ({ ...prev, [id]: data }));
  };

  const refreshComments = () => {
    if (postId) {
      onCommentsRefresh?.();
      return;
    }
    if (!photoId) return;
    getPhotoComments(photoId)
      .then((data) => saveComments(photoId, data))
      .catch(() => toast.error(t("toasts.commentsLoadError")));
  };

  useEffect(() => {
    if (postId || !photoId) return;

    getPhotoComments(photoId)
      .then((data) =>
        setCommentsByPhotoId((prev) => ({ ...prev, [photoId]: data })),
      )
      .catch(() => {
        setCommentsByPhotoId((prev) =>
          prev[photoId] ? prev : { ...prev, [photoId]: [] },
        );
        toast.error(t("toasts.commentsLoadError"));
      });
  }, [postId, photoId, t]);

  const deleteComment = async (commentId: string) => {
    try {
      await deleteCommentApi(commentId);
      refreshComments();
    } catch {
      toast.error(t("toasts.commentDeleteError"));
    }
  };

  const editComment = async (commentId: string, content: string) => {
    try {
      await updateComment(commentId, content);
      refreshComments();
    } catch {
      toast.error(t("toasts.commentSaveError"));
    }
  };

  return {
    comments,
    commentsLoading,
    refreshComments,
    deleteComment,
    editComment,
  };
};
