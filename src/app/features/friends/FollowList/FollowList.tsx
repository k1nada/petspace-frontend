"use client";

import styles from "./FollowList.module.scss";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { unfollowUser, removeFollower } from "@/services/api/follows";
import { FollowCard } from "../FollowCard/FollowCard";
import { EmptyState } from "@/app/uikit/feedback/EmptyState/EmptyState";
import { FollowUser, FollowListType } from "@/types";

interface FollowListProps {
  users: FollowUser[];
  type: FollowListType;
  username: string;
  currentUser: string;
  isMyProfile: boolean;
  onRemove: (username: string) => void;
}

export const FollowList = ({
  users,
  type,
  username,
  currentUser,
  isMyProfile,
  onRemove,
}: FollowListProps) => {
  const t = useTranslations();
  const isFollowers = type === "followers";

  const removeUser = async (targetUsername: string) => {
    try {
      await (isFollowers ? removeFollower : unfollowUser)(
        username,
        targetUsername,
      );
      onRemove(targetUsername);
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  if (!users.length) {
    return (
      <EmptyState
        title={t(
          isFollowers ? "friends.emptyFollowersTitle" : "friends.emptyFollowingTitle",
        )}
        text={t(
          isFollowers ? "friends.emptyFollowersText" : "friends.emptyFollowingText",
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
        />
      ))}
    </ul>
  );
};
