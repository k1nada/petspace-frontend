"use client";

import styles from "./FriendCard.module.scss";
import { Button } from "@/app/uikit/form/Button/Button";
import { useTranslations } from "next-intl";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { DropdownMenu } from "@/app/uikit/overlays/DropdownMenu/DropdownMenu";
import { MdDeleteSweep } from "react-icons/md";
import { Friend } from "@/types";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { ROUTES } from "@/routes/routes";
import { Modal } from "@/app/uikit/overlays/Modal/Modal";
import { useState } from "react";
import { deleteFriend } from "@/app/api/friends";
import { toast } from "react-toastify";

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

  const handleDeleteFriend = async () => {
    try {
      await deleteFriend(currentUser, friend.username);
      onFriendDeleted?.(friend.username);
      setIsDeleteOpen(false);
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  return (
    <li className={styles.card}>
      <Link href={ROUTES.profile(friend.username)}>
        <Avatar src={friend.avatar} size={90} isOnline={friend.isOnline} />
      </Link>
      <div className={styles.right}>
        <Link href={ROUTES.profile(friend.username)}>
          <div className={styles.name}>{friend.name}</div>
        </Link>
        <Link href={ROUTES.messages(currentUser, friend.username)}>
          <Button appearance="tertiary" className={styles.button}>
            {t("friends.message")}
          </Button>
        </Link>
      </div>
      {isOwner && (
        <DropdownMenu
          items={[
            {
              label: t("friends.delete"),
              onClick: () => setIsDeleteOpen(true),
              icon: <MdDeleteSweep size={20} />,
            },
          ]}
        />
      )}

      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <h2 className={styles.modalTitle}>{t("friendCard.modalTitle")}</h2>
        <p className={styles.modalDescription}>
          {t("friendCard.modalDescription", { name: friend.name })}
        </p>
        <div className={styles.actions}>
          <Button appearance="secondary" onClick={() => setIsDeleteOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={handleDeleteFriend}>
            {t("common.delete")}
          </Button>
        </div>
      </Modal>
    </li>
  );
};
