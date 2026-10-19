"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { FaMessage } from "react-icons/fa6";
import {
  MdCancel,
  MdOutlineMoreHoriz,
  MdPersonAdd,
  MdPersonRemove,
} from "react-icons/md";
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
import { IconButton } from "@/app/uikit/form/IconButton/IconButton";
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
      icon: <MdPersonRemove size={20} />,
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

  return (
    <UserRow
      username={friend.username}
      name={friend.name}
      avatar={friend.avatar}
      isOnline={friend.isOnline}
      lastSeen={friend.lastSeen}
      fallbackStatus={t("common.offline")}
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
    </UserRow>
  );
};
