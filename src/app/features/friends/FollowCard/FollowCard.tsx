"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import {
  MdAdd,
  MdCheck,
  MdOutlineMoreHoriz,
  MdPersonAdd,
} from "react-icons/md";
import { FaPaw } from "react-icons/fa";
import { FollowUser, FollowListType } from "@/types";
import { ROUTES } from "@/routes/routes";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { useFriendRequestsStore } from "@/app/hooks/friends/useFriendRequestsStore";
import { useFriendRequestActions } from "@/app/hooks/friends/useFriendRequestActions";
import { addFriend } from "@/services/api/friends";
import { revalidateFollows } from "@/services/actions/revalidateFollows";
import { getRelationshipStatus } from "@/utils/friends";
import { IconButton } from "@/app/uikit/form/IconButton/IconButton";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";
import { Dropdown } from "@/app/uikit/overlays/Dropdown/Dropdown";
import { UserRow } from "../UserRow/UserRow";
import styles from "./FollowCard.module.scss";

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
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const requests = useFriendRequestsStore((state) => state.requests);
  const { acceptRequest } = useFriendRequestActions();
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [isFriendLoading, setIsFriendLoading] = useState(false);

  const isSelf = user.username === currentUser;
  const canManage = isOwner && !isSelf;
  const isAlreadyFollowing = !!currentUserData?.following?.includes(user.id);
  const canFollowBack =
    canManage && type === "followers" && !isAlreadyFollowing && !!onFollowBack;

  const removeLabel =
    type === "followers"
      ? t("followCard.removeFollower")
      : t("friends.unfollow");
  const isFollowersList = type === "followers";
  const modalTitle = isFollowersList
    ? t("followCard.removeModalTitle", { name: user.name || user.username })
    : t("followCard.unfollowModalTitle", { name: user.name || user.username });
  const modalDescription = isFollowersList
    ? t("followCard.removeModalDescription", {
        name: user.name || user.username,
      })
    : t("followCard.unfollowModalDescription");
  const confirmLabel = isFollowersList
    ? t("common.remove")
    : t("friends.unfollow");

  const { isFriend, isPending } = getRelationshipStatus(
    currentUserData,
    user.id,
  );
  const incomingRequest = requests.find(
    (request) => request.from.id === user.id,
  );

  const sendFriendRequest = async () => {
    if (!currentUserData || isFriendLoading) return;
    setIsFriendLoading(true);
    setIsRequestSent(true);
    try {
      await addFriend(currentUserData.username, user.username);
      await revalidateFollows();
      await fetchCurrentUser();
    } catch {
      toast.error(t("toasts.error"));
    } finally {
      setIsRequestSent(false);
      setIsFriendLoading(false);
    }
  };

  const acceptIncomingRequest = async () => {
    if (!incomingRequest || isFriendLoading) return;
    setIsFriendLoading(true);
    try {
      await acceptRequest(incomingRequest);
    } catch {
      toast.error(t("toasts.error"));
    } finally {
      setIsFriendLoading(false);
    }
  };

  let friendButton = null;
  if (type === "followers" && !isSelf && !isFriend) {
    if (incomingRequest) {
      friendButton = (
        <IconButton
          accent
          icon={<MdCheck size={18} />}
          label={t("friendRequest.accept")}
          onClick={acceptIncomingRequest}
          disabled={isFriendLoading}
        />
      );
    } else if (isPending || isRequestSent) {
      friendButton = (
        <IconButton
          icon={<MdCheck size={18} className={styles.sentIcon} />}
          label={t("profileBanner.requestSent")}
          disabled
        />
      );
    } else {
      friendButton = (
        <IconButton
          icon={<MdAdd size={18} />}
          label={t("common.addFriend")}
          onClick={sendFriendRequest}
          disabled={isFriendLoading}
        />
      );
    }
  }

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
      icon: <FaPaw size={16} />,
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
      name={user.name || user.username}
      avatar={user.avatar}
      fallbackStatus={t("followCard.followersCount", {
        count: user.followersCount,
      })}
      onMessage={isSelf ? undefined : goToMessages}
      actions={
        friendButton || showMenu ? (
          <>
            {friendButton}
            {showMenu && (
              <Dropdown
                label={t("common.moreActions")}
                triggerAppearance="iconButton"
                trigger={<MdOutlineMoreHoriz size={18} />}
                items={menuItems}
              />
            )}
          </>
        ) : undefined
      }
    >
      <ConfirmModal
        isOpen={isModalOpen}
        title={modalTitle}
        description={modalDescription}
        confirmLabel={confirmLabel}
        onConfirm={handleConfirm}
        onClose={() => setIsModalOpen(false)}
      />
    </UserRow>
  );
};
