import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { repostPost } from "@/services/api/post";

interface UsePostRepostProps {
  postId: string;
  initialReposted: boolean;
  initialCount: number;
  onChange?: (reposted: boolean, count: number) => void;
}

export const usePostRepost = ({
  postId,
  initialReposted,
  initialCount,
  onChange,
}: UsePostRepostProps) => {
  const t = useTranslations();
  const [reposted, setReposted] = useState(initialReposted);
  const [repostCount, setRepostCount] = useState(initialCount);
  const [repostLoading, setRepostLoading] = useState(false);

  const handleToggleRepost = async () => {
    if (repostLoading) return false;
    setRepostLoading(true);
    let isDone = false;
    try {
      const { reposted: newReposted, count } = await repostPost(postId);
      setReposted(newReposted);
      setRepostCount(count);
      onChange?.(newReposted, count);
      isDone = true;
    } catch {
      toast.error(t("toasts.error"));
    }
    setRepostLoading(false);
    return isDone;
  };

  return { reposted, repostCount, repostLoading, handleToggleRepost };
};
