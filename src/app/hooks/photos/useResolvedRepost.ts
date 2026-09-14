import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { repostPhoto } from "@/services/api/post";
import { Photo, RepostState } from "@/types";

interface UseResolvedRepostProps {
  photo: Photo | null;
  repostState?: RepostState;
}

export const useResolvedRepost = ({
  photo,
  repostState,
}: UseResolvedRepostProps) => {
  const t = useTranslations();
  const photoId = photo?.id;

  const [reposted, setReposted] = useState(photo?.reposted ?? false);
  const [repostsCount, setRepostsCount] = useState(photo?.repostsCount ?? 0);
  const [repostLoading, setRepostLoading] = useState(false);
  const [prevPhotoId, setPrevPhotoId] = useState(photoId);

  if (photoId !== prevPhotoId) {
    setPrevPhotoId(photoId);
    setReposted(photo?.reposted ?? false);
    setRepostsCount(photo?.repostsCount ?? 0);
  }

  const toggleRepost = async () => {
    if (!photoId || repostLoading) return;
    setRepostLoading(true);

    try {
      const result = await repostPhoto(photoId);
      setReposted(result.reposted);
      setRepostsCount(result.count);
      setRepostLoading(false);
    } catch {
      toast.error(t("toasts.error"));
      setRepostLoading(false);
    }
  };

  if (repostState) {
    return {
      reposted: repostState.reposted,
      displayCount: repostState.count,
      repostLoading: repostState.loading,
      toggleRepost: repostState.onToggle,
    };
  }

  return {
    reposted,
    displayCount: repostsCount,
    repostLoading,
    toggleRepost,
  };
};
