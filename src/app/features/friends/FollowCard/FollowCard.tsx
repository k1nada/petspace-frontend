"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FaMessage } from "react-icons/fa6";
import {
  MdOutlineMoreHoriz,
  MdPersonAdd,
  MdPersonRemove,
} from "react-icons/md";
import { FollowUser, FollowListType } from "@/types";
import { ROUTES } from "@/routes/routes";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";
import { Dropdown } from "@/app/uikit/overlays/Dropdown/Dropdown";
import { IconButton } from "@/app/uikit/form/IconButton/IconButton";
import { UserRow } from "../UserRow/UserRow";

interface FollowCardProps {
  user: FollowUser;
  currentUser: string;
  type: FollowListType;
  isOwner?: boolean;
  onRemoved?: (username: string) => Promise<void>;
  onFollowBack?: (user: FollowUser) => Promise<void>;
}

export const FollowCard = ({
  user,
  currentUser,
  type,
  isOwner = false,
  onRemoved,
  onFollowBack,
}: FollowCardProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowBackLoading, setIsFollowBackLoading] = useState(false);
  const currentUserData = useAuthStore((state) => state.currentUser);

  const isSelf = user.username === currentUser;
  const canManage = isOwner && !isSelf;
  const isAlreadyFollowing = !!currentUserData?.following?.includes(user.id);
  const canFollowBack =
    canManage && type === "followers" && !isAlreadyFollowing && !!onFollowBack;

  const removeLabel =
    type === "followers"
      ? t("followCard.removeFollower")
      : t("friends.unfollow");
  const modalDescription = t(
    type === "followers"
      ? "followCard.removeModalDescription"
      : "followCard.unfollowModalDescription",
    { name: user.name },
  );

  const goToMessages = () => {
    router.push(ROUTES.messages(currentUser, user.username));
  };

  const handleConfirm = async () => {
    await onRemoved?.(user.username);
    setIsModalOpen(false);
  };

  const handleFollowBack = async () => {
    if (isFollowBackLoading) return;
    setIsFollowBackLoading(true);
    try {
      await onFollowBack?.(user);
    } finally {
      setIsFollowBackLoading(false);
    }
  };

  const menuItems = [];
  if (canManage) {
    menuItems.push({
      label: removeLabel,
      icon: <MdPersonRemove size={20} />,
      onClick: () => setIsModalOpen(true),
    });
  }
  if (canFollowBack) {
    menuItems.push({
      label: t("followCard.followBack"),
      icon: <MdPersonAdd size={20} />,
      onClick: handleFollowBack,
    });
  }

  return (
    <UserRow
      username={user.username}
      name={user.name}
      avatar={user.avatar}
      isOnline={user.isOnline}
      lastSeen={user.lastSeen}
      fallbackStatus={t("followCard.followersCount", {
        count: user.followersCount,
      })}
      actions={
        isSelf ? undefined : (
          <>
            <IconButton
              icon={<FaMessage size={18} />}
              label={t("common.message")}
              onClick={goToMessages}
            />
            {menuItems.length > 0 && (
              <Dropdown
                label={t("common.moreActions")}
                triggerAppearance="iconButton"
                trigger={<MdOutlineMoreHoriz size={18} />}
                items={menuItems}
              />
            )}
          </>
        )
      }
    >
      <ConfirmModal
        isOpen={isModalOpen}
        title={removeLabel}
        description={modalDescription}
        onConfirm={handleConfirm}
        onClose={() => setIsModalOpen(false)}
      />
    </UserRow>
  );
};
