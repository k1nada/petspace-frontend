import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import {
  getPhotoComments,
  updateComment,
  deleteComment as deleteCommentApi,
} from "@/services/api/comment";
import { Comment as CommentType, Photo } from "@/types";
import { usePhotoCommentsStore } from "./usePhotoCommentsStore";

export const preloadPhotoComments = (photoId: string) => {
  const { commentsByPhotoId, setComments } = usePhotoCommentsStore.getState();
  if (commentsByPhotoId[photoId]) return;

  getPhotoComments(photoId)
    .then((data) => setComments(photoId, data))
    .catch((error) => console.error(error));
};

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
  const commentsByPhotoId = usePhotoCommentsStore(
    (state) => state.commentsByPhotoId,
  );
  const saveComments = usePhotoCommentsStore((state) => state.setComments);
  const photoId = photo?.id;
  const cachedComments = photoId ? commentsByPhotoId[photoId] : undefined;

  const commentsLoading = !postId && !cachedComments;
  let comments: CommentType[] = [];
  if (postId) comments = photo?.comments ?? [];
  else if (cachedComments) comments = cachedComments;

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
      .then((data) => saveComments(photoId, data))
      .catch(() => {
        const { commentsByPhotoId } = usePhotoCommentsStore.getState();
        if (!commentsByPhotoId[photoId]) saveComments(photoId, []);
        toast.error(t("toasts.commentsLoadError"));
      });
  }, [postId, photoId, t, saveComments]);

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
