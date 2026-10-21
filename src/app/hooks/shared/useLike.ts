import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

interface UseLikeProps {
  initialLiked: boolean;
  initialCount: number;
  onLike: (id: string) => Promise<{ liked: boolean; count: number }>;
  id: string;
  onChange?: (liked: boolean, count: number) => void;
}

export const useLike = ({
  initialLiked,
  initialCount,
  onLike,
  id,
  onChange,
}: UseLikeProps) => {
  const t = useTranslations();
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialCount);
  const [likeLoading, setLikeLoading] = useState(false);
  const [prevId, setPrevId] = useState(id);

  if (id !== prevId) {
    setPrevId(id);
    setLiked(initialLiked);
    setLikesCount(initialCount);
  }

  const toggleLike = async () => {
    if (likeLoading) return;
    const prevLiked = liked;
    const prevCount = likesCount;
    const nextLiked = !liked;
    const nextCount = nextLiked ? likesCount + 1 : Math.max(likesCount - 1, 0);

    setLiked(nextLiked);
    setLikesCount(nextCount);
    onChange?.(nextLiked, nextCount);
    setLikeLoading(true);

    try {
      const { liked: newLiked, count } = await onLike(id);
      if (newLiked !== nextLiked || count !== nextCount) {
        setLiked(newLiked);
        setLikesCount(count);
        onChange?.(newLiked, count);
      }
    } catch {
      setLiked(prevLiked);
      setLikesCount(prevCount);
      onChange?.(prevLiked, prevCount);
      toast.error(t("toasts.likeError"));
    } finally {
      setLikeLoading(false);
    }
  };

  const displayCount = likesCount > 0 ? likesCount : null;

  return { liked, displayCount, likeLoading, toggleLike };
};
