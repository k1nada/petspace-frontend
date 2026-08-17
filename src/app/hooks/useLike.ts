import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

interface UseLikeProps {
  initialLiked: boolean;
  initialCount: number;
  onLike: (id: string) => Promise<{ liked: boolean; count: number }>;
  id: string;
}

export const useLike = ({ initialLiked, initialCount, onLike, id }: UseLikeProps) => {
  const t = useTranslations();
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialCount);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);

    try {
      const { liked: newLiked, count } = await onLike(id);
      setLiked(newLiked);
      setLikesCount(count);
    } catch {
      toast.error(t("toasts.error"));
    } finally {
      setLikeLoading(false);
    }
  };

  const displayCount = likesCount > 0 ? likesCount : null;

  return { liked, displayCount, likeLoading, handleLike };
};