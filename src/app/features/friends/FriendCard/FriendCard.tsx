"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { MdCancel, MdOutlineMoreHoriz, MdPersonAdd } from "react-icons/md";
import { FaPaw } from "react-icons/fa";
import { Friend } from "@/types";
import { ROUTES } from "@/routes/routes";
import { useRouter } from "@/i18n/navigation";
import {
  addFriend as addFriendAPI,
  deleteFriend,
} from "@/services/api/friends";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { revalidateFollows } from "@/services/actions/revalidateFollows";
import { getRelationshipStatus } from "@/utils/friends";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";
import { Dropdown } from "@/app/uikit/overlays/Dropdown/Dropdown";
import { UserRow } from "../UserRow/UserRow";

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
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const currentUserData = useAuthStore((state) => state.currentUser);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const { isFriend, isPending, isFollowing } = getRelationshipStatus(
    currentUserData,
    friend.id,
  );
  const isSelf = friend.username === currentUser;

  const goToMessages = () => {
    router.push(ROUTES.messages(currentUser, friend.username));
  };

  const handleDeleteFriend = async () => {
    try {
      await deleteFriend(currentUser, friend.username);
      await revalidateFollows();
      await fetchCurrentUser();
      onFriendDeleted?.(friend.username);
      setIsDeleteOpen(false);
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const handleAddFriend = async () => {
    if (isRequestLoading) return;
    setIsRequestLoading(true);
    try {
      await addFriendAPI(currentUser, friend.username);
      await revalidateFollows();
      await fetchCurrentUser();
    } catch {
      toast.error(t("toasts.error"));
    } finally {
      setIsRequestLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (isRequestLoading) return;
    setIsRequestLoading(true);
    try {
      await deleteFriend(currentUser, friend.username);
      await revalidateFollows();
      await fetchCurrentUser();
    } catch {
      toast.error(t("toasts.error"));
    } finally {
      setIsRequestLoading(false);
    }
  };

  const menuItems = [];
  if (isOwner) {
    menuItems.push({
      label: t("profileBanner.removeFriend"),
      icon: <FaPaw size={16} />,
      onClick: () => setIsDeleteOpen(true),
    });
  } else if (!isFriend && isPending) {
    menuItems.push({
      label: t("profileBanner.cancelRequest"),
      icon: <MdCancel size={20} />,
      onClick: handleCancelRequest,
    });
  } else if (!isFriend && !isFollowing) {
    menuItems.push({
      label: t("common.addFriend"),
      icon: <MdPersonAdd size={20} />,
      onClick: handleAddFriend,
    });
  }

  const showMenu = !isSelf && menuItems.length > 0;

  return (
    <UserRow
      userId={friend.id}
      username={friend.username}
      name={friend.name || friend.username}
      avatar={friend.avatar}
      isOnline={friend.isOnline}
      lastSeen={friend.lastSeen}
      fallbackStatus={t("common.offline")}
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
      {isOwner && (
        <ConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteFriend}
          title={t("friendCard.modalTitle", {
            name: friend.name || friend.username,
          })}
          description={t("friendCard.modalDescription", {
            name: friend.name || friend.username,
          })}
          confirmLabel={t("common.remove")}
        />
      )}
    </UserRow>
  );
};
