"use client";

import cn from "classnames";
import styles from "./FriendCard.module.scss";
import { Button } from "@/app/uikit/form/Button/Button";
import { useTranslations } from "next-intl";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { DropdownMenu } from "@/app/uikit/overlays/DropdownMenu/DropdownMenu";
import { MdDeleteSweep } from "react-icons/md";
import { Friend } from "@/types";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { ROUTES } from "@/routes/routes";
import { useState } from "react";
import { addFriend as addFriendAPI, deleteFriend } from "@/app/api/friends";
import { toast } from "react-toastify";
import { useUserStore } from "@/app/hooks/useUserStore";
import { getRelationshipStatus } from "@/utils/friends";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";

interface FriendCardProps {
  friend: Friend;
  currentUser: string;
  isOwner?: boolean;
  onFriendDeleted?: (friendUsername: string) => void;
}

export const FriendCard = ({
  friend,
  currentUser,
  isOwner = false,
  onFriendDeleted,
}: FriendCardProps) => {
  const t = useTranslations();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const currentUserData = useUserStore((state) => state.currentUser);
  const fetchCurrentUser = useUserStore((state) => state.fetchCurrentUser);
  const { isFriend, isPending, isFollowing } = getRelationshipStatus(
    currentUserData,
    friend.id,
  );

  const handleDeleteFriend = async () => {
    try {
      await deleteFriend(currentUser, friend.username);
      onFriendDeleted?.(friend.username);
      setIsDeleteOpen(false);
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const handleAddFriend = async () => {
    try {
      await addFriendAPI(currentUser, friend.username);
      await fetchCurrentUser();
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const handleCancelRequest = async () => {
    try {
      await deleteFriend(currentUser, friend.username);
      await fetchCurrentUser();
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  return (
    <li className={styles.card}>
      <Link href={ROUTES.profile(friend.username)}>
        <Avatar src={friend.avatar} size={70} isOnline={friend.isOnline} />
      </Link>

      <div className={styles.info}>
        <Link href={ROUTES.profile(friend.username)}>
          <div className={styles.name}>{friend.name}</div>
        </Link>
        <div
          className={cn(styles.status, { [styles.online]: friend.isOnline })}
        >
          {friend.isOnline ? t("common.online") : t("common.offline")}
        </div>
      </div>

      <div className={styles.actions}>
        {isOwner ? (
          <Link href={ROUTES.messages(currentUser, friend.username)}>
            <Button appearance="primary">{t("friends.message")}</Button>
          </Link>
        ) : (
          <>
            <Link href={ROUTES.messages(currentUser, friend.username)}>
              <Button appearance="secondary">{t("friends.message")}</Button>
            </Link>
            {!isFriend &&
              (isPending ? (
                <Button appearance="secondary" onClick={handleCancelRequest}>
                  {t("friends.sent")}
                </Button>
              ) : isFollowing ? (
                <Button appearance="secondary" disabled>
                  {t("friends.following")}
                </Button>
              ) : (
                <Button appearance="primary" onClick={handleAddFriend}>
                  {t("friends.addFriend")}
                </Button>
              ))}
          </>
        )}
      </div>

      {isOwner && (
        <div className={styles.menu}>
          <DropdownMenu
            items={[
              {
                label: t("friends.delete"),
                onClick: () => setIsDeleteOpen(true),
                icon: <MdDeleteSweep size={20} />,
              },
            ]}
          />
        </div>
      )}

      {isOwner && (
        <ConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteFriend}
          title={t("friendCard.modalTitle")}
          description={t("friendCard.modalDescription", {
            name: friend.name,
          })}
        />
      )}
    </li>
  );
};
