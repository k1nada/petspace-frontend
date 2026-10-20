"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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

  const showMenu = !isSelf && menuItems.length > 0;

  return (
    <UserRow
      username={user.username}
      name={user.name}
      avatar={user.avatar}
      fallbackStatus={t("followCard.followersCount", {
        count: user.followersCount,
      })}
      onMessage={isSelf ? undefined : goToMessages}
      actions={
        showMenu ? (
          <Dropdown
            label={t("common.moreActions")}
            triggerAppearance="iconButton"
            trigger={<MdOutlineMoreHoriz size={18} />}
            items={menuItems}
          />
        ) : undefined
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
