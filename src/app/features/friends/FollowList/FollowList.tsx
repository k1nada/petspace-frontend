"use client";

import { useState } from "react";
import styles from "./FollowList.module.scss";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { unfollowUser, removeFollower } from "@/app/api/follows";
import { FollowCard } from "../FollowCard/FollowCard";
import { EmptyState } from "@/app/uikit/feedback/EmptyState/EmptyState";
import { FollowUser, FollowListType } from "@/types";

interface FollowListProps {
  initialUsers: FollowUser[];
  type: FollowListType;
  username: string;
  currentUser: string;
  isMyProfile: boolean;
}

export const FollowList = ({
  initialUsers,
  type,
  username,
  currentUser,
  isMyProfile,
}: FollowListProps) => {
  const t = useTranslations();
  const [users, setUsers] = useState(initialUsers);
  const isFollowers = type === "followers";

  const removeUser = async (targetUsername: string) => {
    try {
      await (isFollowers ? removeFollower : unfollowUser)(
        username,
        targetUsername,
      );
      setUsers((prev) => prev.filter((u) => u.username !== targetUsername));
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
