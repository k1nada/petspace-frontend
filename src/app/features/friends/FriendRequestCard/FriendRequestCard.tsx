"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FaCheck, FaTimes } from "react-icons/fa";
import { Button } from "@/app/uikit/form/Button/Button";
import { IconButton } from "@/app/uikit/form/IconButton/IconButton";
import { FriendRequest as FriendRequestType } from "@/types";
import { UserRow } from "../UserRow/UserRow";
import styles from "./FriendRequestCard.module.scss";

interface FriendRequestCardProps {
  request: FriendRequestType;
  onAccept: (request: FriendRequestType) => Promise<void>;
  onReject: (request: FriendRequestType) => Promise<void>;
}

export const FriendRequestCard = ({
  request,
  onAccept,
  onReject,
}: FriendRequestCardProps) => {
  const t = useTranslations();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onAccept(request);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onReject(request);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <UserRow
      userId={request.from.id}
      username={request.from.username}
      name={request.from.name || request.from.username}
      avatar={request.from.avatar}
      isOnline={request.from.isOnline}
      fallbackStatus={t("friendRequest.wantsToBeFriends")}
      actions={
        <>
          <Button
            appearance="primary"
            className={styles.acceptButton}
            onClick={handleAccept}
            disabled={isProcessing}
          >
            {t("friendRequest.accept")}
          </Button>
          <div className={styles.acceptIcon}>
            <IconButton
              accent
              icon={<FaCheck size={16} />}
              label={t("friendRequest.accept")}
              onClick={handleAccept}
              disabled={isProcessing}
            />
          </div>
          <IconButton
            icon={<FaTimes size={16} />}
            label={t("friendRequest.decline")}
            onClick={handleReject}
            disabled={isProcessing}
          />
        </>
      }
    />
  );
};
