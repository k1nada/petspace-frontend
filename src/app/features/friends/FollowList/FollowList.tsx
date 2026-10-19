"use client";

import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import {
  followUser,
  unfollowUser,
  removeFollower,
} from "@/services/api/follows";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { revalidateFollows } from "@/services/actions/revalidateFollows";
import { EmptyState } from "@/app/uikit/feedback/EmptyState/EmptyState";
import { FollowUser, FollowListType } from "@/types";
import { FollowCard } from "../FollowCard/FollowCard";
import styles from "./FollowList.module.scss";

interface FollowListProps {
  users: FollowUser[];
  type: FollowListType;
  username: string;
  currentUser: string;
  isMyProfile: boolean;
  onRemove: (username: string) => void;
  onFollowBack?: (user: FollowUser) => void;
}

export const FollowList = ({
  users,
  type,
  username,
  currentUser,
  isMyProfile,
  onRemove,
  onFollowBack,
}: FollowListProps) => {
  const t = useTranslations();
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const isFollowers = type === "followers";

  const removeUser = async (targetUsername: string) => {
    try {
      if (isFollowers) {
        await removeFollower(username, targetUsername);
      } else {
        await unfollowUser(username, targetUsername);
      }
      await revalidateFollows();
      await fetchCurrentUser();
      onRemove(targetUsername);
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const followBack = async (user: FollowUser) => {
    try {
      await followUser(username, user.username);
      await revalidateFollows();
      await fetchCurrentUser();
      onFollowBack?.(user);
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  if (!users.length) {
    return (
      <EmptyState
        title={t(
          isFollowers
            ? "friends.emptyFollowersTitle"
            : "friends.emptyFollowingTitle",
        )}
        text={t(
          isFollowers
            ? "friends.emptyFollowersText"
            : "friends.emptyFollowingText",
        )}
      />
    );
  }

  return (
    <ul className={styles.list}>
      {users.map((user) => (
        <FollowCard
          key={user.id}
          user={user}
          currentUser={currentUser}
          type={type}
          isOwner={isMyProfile}
          onRemoved={removeUser}
          onFollowBack={isFollowers ? followBack : undefined}
        />
      ))}
    </ul>
  );
};
