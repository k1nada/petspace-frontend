import { useLike } from "@/app/hooks/shared/useLike";
import { likePhoto } from "@/services/api/likes";
import { Photo } from "@/types";

export interface LikeState {
  liked: boolean;
  displayCount: number | null;
  likeLoading: boolean;
  onToggle: () => void;
}

interface UseResolvedLikeProps {
  photo: Photo | null;
  postId?: string;
  likeState?: LikeState;
  onLikeChange?: (photoId: string, liked: boolean, likesCount: number) => void;
}

export const useResolvedLike = ({
  photo,
  postId,
  likeState,
  onLikeChange,
}: UseResolvedLikeProps) => {
  const photoId = photo?.id;

  const internalLike = useLike({
    initialLiked: photo?.liked ?? false,
    initialCount: photo?.likesCount ?? 0,
    onLike: likePhoto,
    id: postId ?? photoId ?? "",
    onChange: (newLiked, count) => {
      if (photoId) onLikeChange?.(photoId, newLiked, count);
    },
  });

  return {
    liked: likeState?.liked ?? internalLike.liked,
    displayCount: likeState?.displayCount ?? internalLike.displayCount,
    likeLoading: likeState?.likeLoading ?? internalLike.likeLoading,
    toggleLike: likeState?.onToggle ?? internalLike.toggleLike,
  };
};
