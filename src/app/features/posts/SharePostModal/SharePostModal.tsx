"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { BsHouseDoorFill } from "react-icons/bs";
import { MdCheck } from "react-icons/md";
import { Modal } from "@/app/uikit/overlays/Modal/Modal";
import { ModalActions } from "@/app/uikit/overlays/ModalActions/ModalActions";
import { Button } from "@/app/uikit/form/Button/Button";
import { SearchBar } from "@/app/uikit/navigation/SearchBar/SearchBar";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { useSearch } from "@/app/hooks/shared/useSearch";
import socket from "@/services/socket";
import { SendMessageAck } from "@/types";
import { SEND_TIMEOUT_MS, SOCKET_EVENTS, getRoomId } from "@/utils/chat";
import styles from "./SharePostModal.module.scss";

const AVATAR_SIZE = 40;
const VISIBLE_FRIENDS_COUNT = 4;

interface SharePostModalProps {
  isOpen: boolean;
  postId?: string;
  photoId?: string;
  isOwner?: boolean;
  isReposted?: boolean;
  onClose: () => void;
  onShareToWall: () => Promise<boolean>;
}

export const SharePostModal = ({
  isOpen,
  postId,
  photoId,
  isOwner,
  isReposted,
  onClose,
  onShareToWall,
}: SharePostModalProps) => {
  const t = useTranslations();
  const currentUser = useAuthStore((state) => state.currentUser);
  const friends = currentUser?.friends ?? [];

  const [isSharing, setIsSharing] = useState(false);
  const [sendingFriendId, setSendingFriendId] = useState<string | null>(null);
  const [sentFriendIds, setSentFriendIds] = useState<string[]>([]);

  const { query, results, isEmpty, search } = useSearch();

  const isSearching = query.trim().length > 0;
  const foundUsers = results.filter((user) => user.id !== currentUser?.id);
  const people = isSearching
    ? foundUsers
    : friends.slice(0, VISIBLE_FRIENDS_COUNT);

  const handleClose = () => {
    search("");
    setSentFriendIds([]);
    onClose();
  };

  const sendToFriend = (friendId: string) => {
    if (!currentUser?.id) return;
    if (sendingFriendId || sentFriendIds.includes(friendId)) return;

    if (!socket.connected) {
      toast.error(t("toasts.error"));
      return;
    }

    setSendingFriendId(friendId);
    const roomId = getRoomId(currentUser.id, friendId);
    socket
      .timeout(SEND_TIMEOUT_MS)
      .emit(
        SOCKET_EVENTS.MESSAGE,
        { roomId, text: "", postId, photoId },
        (err: Error | null, response?: SendMessageAck) => {
          setSendingFriendId(null);
          if (err || !response?.message) {
            toast.error(t("toasts.error"));
            return;
          }
          setSentFriendIds((prev) => [...prev, friendId]);
          toast.success(
            photoId ? t("sharePostModal.photoSent") : t("sharePostModal.sent"),
          );
        },
      );
  };

  const shareToWall = async () => {
    if (isSharing) return;
    setIsSharing(true);
    const isDone = await onShareToWall();
    setIsSharing(false);

    if (!isDone) return;
    if (!isReposted) {
      toast.success(t("sharePostModal.sharedToWall"));
    }
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className={styles.modal}>
      <h2 className={styles.title}>
        {photoId ? t("sharePostModal.photoTitle") : t("sharePostModal.title")}
      </h2>

      {!isOwner && (
        <div className={styles.row}>
          <span className={styles.wallIcon}>
            <BsHouseDoorFill />
          </span>
          <span className={styles.rowInfo}>
            <span className={styles.sectionTitle}>
              {t("sharePostModal.wallTitle")}
            </span>
            <span className={styles.wallHint}>
              {isReposted
                ? t("sharePostModal.alreadyOnWall")
                : t("sharePostModal.wallHint")}
            </span>
          </span>
          <Button
            appearance="secondary"
            className={styles.rowButton}
            onClick={shareToWall}
            disabled={isSharing}
          >
            {isReposted
              ? t("post.undoRepost")
              : t("sharePostModal.shareToWall")}
          </Button>
        </div>
      )}

      <div className={styles.friendsSection}>
        {!isOwner && (
          <p className={styles.sectionTitle}>
            {t("sharePostModal.sendToFriend")}
          </p>
        )}

        <SearchBar
          value={query}
          onChange={search}
          placeholder={t("sharePostModal.searchPlaceholder")}
          fullWidth
        />

        {people.length > 0 && (
          <ul className={styles.list}>
            {people.map((user) => {
              const isSent = sentFriendIds.includes(user.id);

              return (
                <li key={user.id} className={styles.row}>
                  <Avatar src={user.avatar} size={AVATAR_SIZE} />
                  <span className={styles.rowInfo}>
                    <span className={styles.rowName}>
                      {user.name || user.username}
                    </span>
                    <span className={styles.rowHint}>@{user.username}</span>
                  </span>
                  <Button
                    appearance="secondary"
                    className={styles.rowButton}
                    onClick={() => sendToFriend(user.id)}
                    disabled={isSent || sendingFriendId === user.id}
                  >
                    {isSent && <MdCheck size={16} />}
                    {isSent
                      ? t("sharePostModal.sentButton")
                      : t("sharePostModal.send")}
                  </Button>
                </li>
              );
            })}
          </ul>
        )}

        {isSearching && isEmpty && (
          <p className={styles.empty}>{t("searchBar.noResults")}</p>
        )}

        {!isSearching && friends.length === 0 && (
          <p className={styles.empty}>{t("common.noFriendsYet")}</p>
        )}
      </div>

      <ModalActions>
        <Button appearance="secondary" onClick={handleClose}>
          {t("sharePostModal.close")}
        </Button>
      </ModalActions>
    </Modal>
  );
};
