import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import {
  deleteComment as deleteCommentRequest,
  updateComment as updateCommentRequest,
} from "@/services/api/comment";
import { Comment as CommentType } from "@/types";

interface UsePostCommentsProps {
  comments: CommentType[];
  hasComments: boolean;
  onRefresh: () => void;
}

export const usePostComments = ({
  comments,
  hasComments,
  onRefresh,
}: UsePostCommentsProps) => {
  const t = useTranslations();
  const [showCommentCreator, setShowCommentCreator] = useState(hasComments);
  const [replyTo, setReplyTo] = useState<{
    commentId: string;
    name: string;
  } | null>(null);

  const rootComments = comments.filter((comment) => !comment.parent);
  const repliesFor = (commentId: string) =>
    comments.filter((comment) => comment.parent === commentId);

  const replyComment = (commentId: string, name: string) => {
    setShowCommentCreator(true);
    setReplyTo((prev) =>
      prev?.commentId === commentId ? null : { commentId, name },
    );
  };

  const deleteComment = async (commentId: string) => {
    try {
      await deleteCommentRequest(commentId);
      onRefresh();
    } catch {
      toast.error(t("toasts.commentDeleteError"));
    }
  };

  const editComment = async (commentId: string, content: string) => {
    try {
      await updateCommentRequest(commentId, content);
      onRefresh();
    } catch {
      toast.error(t("toasts.commentSaveError"));
    }
  };

  const onCommentCreated = () => {
    onRefresh();
    setReplyTo(null);
  };

  return {
    showCommentCreator,
    setShowCommentCreator,
    replyTo,
    rootComments,
    repliesFor,
    replyComment,
    deleteComment,
    editComment,
    onCommentCreated,
  };
};
