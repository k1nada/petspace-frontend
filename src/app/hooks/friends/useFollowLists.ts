import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { FollowUser } from "@/types";
import { unfollowUser } from "@/services/api/follows";
import { revalidateFollows } from "@/services/actions/revalidateFollows";

interface UseFollowListsProps {
  username: string;
  followers: FollowUser[];
  following: FollowUser[];
}

export const useFollowLists = ({
  username,
  followers: initialFollowers,
  following: initialFollowing,
}: UseFollowListsProps) => {
  const t = useTranslations();
  const [followers, setFollowers] = useState(initialFollowers);
  const [following, setFollowing] = useState(initialFollowing);
  const [isConfirmAllOpen, setIsConfirmAllOpen] = useState(false);

  const removeFollower = (targetUsername: string) =>
    setFollowers((prev) => prev.filter((u) => u.username !== targetUsername));

  const removeFollowing = (targetUsername: string) =>
    setFollowing((prev) => prev.filter((u) => u.username !== targetUsername));

  const addFollowing = (user: FollowUser) =>
    setFollowing((prev) =>
      prev.some((u) => u.id === user.id) ? prev : [user, ...prev],
    );

  const unfollowAll = async () => {
    setIsConfirmAllOpen(false);
    const stillFollowing: FollowUser[] = [];
    for (const u of following) {
      try {
        await unfollowUser(username, u.username);
      } catch {
        stillFollowing.push(u);
      }
    }
    setFollowing(stillFollowing);
    await revalidateFollows();
    if (stillFollowing.length > 0) {
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
    addFollowing,
    unfollowAll,
    isConfirmAllOpen,
    openConfirmAll: () => setIsConfirmAllOpen(true),
    closeConfirmAll: () => setIsConfirmAllOpen(false),
  };
};
