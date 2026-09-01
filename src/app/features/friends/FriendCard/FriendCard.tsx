"use client";

import styles from "./FriendCard.module.scss";
import { Button } from "@/app/uikit/form/Button/Button";
import { useLocale, useTranslations } from "next-intl";
import dayjs from "@/utils/dayjs";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { DropdownMenu } from "@/app/uikit/overlays/DropdownMenu/DropdownMenu";
import { MdDeleteSweep } from "react-icons/md";
import { Friend } from "@/types";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { ROUTES } from "@/routes/routes";
import { useState } from "react";
import {
  addFriend as addFriendAPI,
  deleteFriend,
} from "@/services/api/friends";
import { toast } from "react-toastify";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
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
  const locale = useLocale();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const currentUserData = useAuthStore((state) => state.currentUser);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
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
        {!friend.isOnline && (
          <div className={styles.status}>
            {friend.lastSeen
              ? t("friends.lastSeen", {
                  time: dayjs(friend.lastSeen).locale(locale).fromNow(),
                })
              : t("common.offline")}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        {isOwner ? (
          <Link href={ROUTES.messages(currentUser, friend.username)}>
            <Button appearance="primary">{t("common.message")}</Button>
          </Link>
        ) : (
          <>
            <Link href={ROUTES.messages(currentUser, friend.username)}>
              <Button appearance="secondary">{t("common.message")}</Button>
            </Link>
            {!isFriend &&
              (isPending ? (
                <Button appearance="secondary" onClick={handleCancelRequest}>
                  {t("friends.sent")}
                </Button>
              ) : isFollowing ? (
                <Button appearance="secondary" disabled>
                  {t("common.following")}
                </Button>
              ) : (
                <Button appearance="primary" onClick={handleAddFriend}>
                  {t("common.addFriend")}
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
                label: t("common.delete"),
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
