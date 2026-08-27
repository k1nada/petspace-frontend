import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import api from "@/config/axios";
import { getPhotoComments, updateComment } from "@/app/api/comment";
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
  const [fetchedComments, setFetchedComments] = useState<CommentType[]>(
    photo?.comments ?? [],
  );
  const comments = postId ? (photo?.comments ?? []) : fetchedComments;
  const photoId = photo?.id;

  const refreshComments = () => {
    if (postId) {
      onCommentsRefresh?.();
      return;
    }
    if (!photoId) return;
    getPhotoComments(photoId).then((data) => {
      if (data) setFetchedComments(data);
    });
  };

  useEffect(() => {
    if (postId) return;
    refreshComments();
  }, [postId, photoId]);

  const deleteComment = async (commentId: string) => {
    try {
      await api.delete(`/comments/${commentId}`);
      refreshComments();
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const editComment = async (commentId: string, content: string) => {
    try {
      await updateComment(commentId, content);
      refreshComments();
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  return { comments, refreshComments, deleteComment, editComment };
};
