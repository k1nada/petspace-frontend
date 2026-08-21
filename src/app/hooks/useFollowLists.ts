import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { FollowUser } from "@/types";
import { unfollowUser } from "@/app/api/follows";

interface UseFollowListsParams {
  username: string;
  followers: FollowUser[];
  following: FollowUser[];
}

export const useFollowLists = ({
  username,
  followers: initialFollowers,
  following: initialFollowing,
}: UseFollowListsParams) => {
  const t = useTranslations();
  const [followers, setFollowers] = useState(initialFollowers);
  const [following, setFollowing] = useState(initialFollowing);
  const [isConfirmAllOpen, setIsConfirmAllOpen] = useState(false);

  const removeFollower = (targetUsername: string) =>
    setFollowers((prev) => prev.filter((u) => u.username !== targetUsername));

  const removeFollowing = (targetUsername: string) =>
    setFollowing((prev) => prev.filter((u) => u.username !== targetUsername));

  const unfollowAll = async () => {
    setIsConfirmAllOpen(false);
    try {
      await Promise.all(
        following.map((u) => unfollowUser(username, u.username)),
      );
      setFollowing([]);
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  return {
    followersList: followers,
    followersCount: followers.length,
    removeFollower,
    followingList: following,
    followingCount: following.length,
    removeFollowing,
    unfollowAll,
    isConfirmAllOpen,
    openConfirmAll: () => setIsConfirmAllOpen(true),
    closeConfirmAll: () => setIsConfirmAllOpen(false),
  };
};
