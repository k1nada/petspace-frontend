"use client";

import styles from "./FriendRequest.module.scss";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { FriendRequestCard } from "../FriendRequestCard/FriendRequestCard";
import { EmptyState } from "@/app/uikit/feedback/EmptyState/EmptyState";
import { useFriendRequestsStore } from "@/app/hooks/friends/useFriendRequestsStore";
import { useFriendRequestActions } from "@/app/hooks/friends/useFriendRequestActions";
import { FriendRequest as FriendRequestType } from "@/types";

export const FriendRequest = () => {
  const t = useTranslations();
  const requests = useFriendRequestsStore((state) => state.requests);
  const { acceptRequest, rejectRequest } = useFriendRequestActions();

  const handleAccept = async (request: FriendRequestType) => {
    try {
      await acceptRequest(request);
      toast.success(t("friendRequest.acceptedSuccess"));
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const handleReject = async (request: FriendRequestType) => {
    try {
      await rejectRequest(request);
      toast.success(t("friendRequest.rejectedSuccess"));
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  if (!requests.length) {
    return (
      <EmptyState
        title={t("friendRequest.title")}
        text={t("friendRequest.empty")}
      />
    );
  }

  return (
    <section className={styles.wrapper}>
      <ul className={styles.list}>
        {requests.map((request) => (
          <FriendRequestCard
            key={request.id}
            request={request}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        ))}
      </ul>
    </section>
  );
};
