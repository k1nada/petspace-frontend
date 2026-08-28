import { useState } from "react";
import {
  deleteComment as deleteCommentRequest,
  updateComment as updateCommentRequest,
} from "@/app/api/comment";
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
    await deleteCommentRequest(commentId);
    onRefresh();
  };

  const editComment = async (commentId: string, content: string) => {
    await updateCommentRequest(commentId, content);
    onRefresh();
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
