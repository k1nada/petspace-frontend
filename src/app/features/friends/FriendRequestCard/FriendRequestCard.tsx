"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MdCheck, MdClose } from "react-icons/md";
import { IconButton } from "@/app/uikit/form/IconButton/IconButton";
import { FriendRequest as FriendRequestType } from "@/types";
import { UserRow } from "../UserRow/UserRow";

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
      name={request.from.name}
      avatar={request.from.avatar}
      isOnline={request.from.isOnline}
      fallbackStatus={t("friendRequest.wantsToBeFriends")}
      actions={
        <>
          <IconButton
            accent
            icon={<MdCheck size={18} />}
            label={t("friendRequest.accept")}
            onClick={handleAccept}
            disabled={isProcessing}
          />
          <IconButton
            icon={<MdClose size={18} />}
            label={t("friendRequest.decline")}
            onClick={handleReject}
            disabled={isProcessing}
          />
        </>
      }
    />
  );
};
