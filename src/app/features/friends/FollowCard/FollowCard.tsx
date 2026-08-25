"use client";

import styles from "./FollowCard.module.scss";
import { Button } from "@/app/uikit/form/Button/Button";
import { useTranslations } from "next-intl";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { FollowUser, FollowListType } from "@/types";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { ROUTES } from "@/routes/routes";
import { useState } from "react";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";

interface FollowCardProps {
  user: FollowUser;
  currentUser: string;
  type: FollowListType;
  isOwner?: boolean;
  onRemoved?: (username: string) => void;
}

export const FollowCard = ({
  user,
  currentUser,
  type,
  isOwner = false,
  onRemoved,
}: FollowCardProps) => {
  const t = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isSelf = user.username === currentUser;
  const canManage = isOwner && !isSelf;

  const actionLabel =
    type === "followers" ? t("common.remove") : t("friends.unfollow");
  const modalDescription = t(
    type === "followers"
      ? "followCard.removeModalDescription"
      : "followCard.unfollowModalDescription",
    { name: user.name },
  );

  const handleConfirm = () => {
    onRemoved?.(user.username);
    setIsModalOpen(false);
  };

  return (
    <li className={styles.card}>
      <Link href={ROUTES.profile(user.username)}>
        <Avatar src={user.avatar} size={70} isOnline={user.isOnline} />
      </Link>

      <div className={styles.info}>
        <Link href={ROUTES.profile(user.username)}>
          <div className={styles.name}>{user.name}</div>
        </Link>
      </div>

      {canManage && (
        <Button appearance="primary" onClick={() => setIsModalOpen(true)}>
          {actionLabel}
        </Button>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        title={actionLabel}
        description={modalDescription}
        onConfirm={handleConfirm}
        onClose={() => setIsModalOpen(false)}
      />
    </li>
  );
};
