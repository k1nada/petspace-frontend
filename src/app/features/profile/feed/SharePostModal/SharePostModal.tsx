"use client";

import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import styles from "./SharePostModal.module.scss";
import { Modal } from "@/app/uikit/overlays/Modal/Modal";
import { Button } from "@/app/uikit/form/Button/Button";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { EmptyState } from "@/app/uikit/feedback/EmptyState/EmptyState";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import socket from "@/services/socket";

interface SharePostModalProps {
  isOpen: boolean;
  postId: string;
  isOwner?: boolean;
  onClose: () => void;
  onShareToWall: () => void;
}

export const SharePostModal = ({
  isOpen,
  postId,
  isOwner,
  onClose,
  onShareToWall,
}: SharePostModalProps) => {
  const t = useTranslations();
  const currentUser = useAuthStore((state) => state.currentUser);
  const friends = currentUser?.friends ?? [];

  const sendToFriend = (friendId: string) => {
    if (!currentUser?.id) return;
    const roomId = [currentUser.id, friendId].sort().join("_");
    socket.emit("message", { roomId, text: "", postId });
    toast.success(t("sharePostModal.sent"));
    onClose();
  };

  const shareToWall = () => {
    onShareToWall();
    toast.success(t("sharePostModal.sharedToWall"));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className={styles.title}>{t("sharePostModal.title")}</h3>
      {!isOwner && (
        <Button
          appearance="secondary"
          className={styles.wallOption}
          onClick={shareToWall}
        >
          <span>{t("sharePostModal.shareToWall")}</span>
        </Button>
      )}
      {friends.length > 0 ? (
        <ul className={styles.list}>
          {friends.map((friend) => (
            <li key={friend.id}>
              <Button
                appearance="ghost"
                className={styles.friend}
                onClick={() => sendToFriend(friend.id)}
              >
                <Avatar src={friend.avatar} size={38} />
                <span className={styles.name}>{friend.name}</span>
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState compact text={t("common.noFriendsText")} />
      )}
    </Modal>
  );
};
