"use client";

import styles from "./FriendRequest.module.scss";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { acceptFriendRequest, rejectFriendRequest } from "@/app/api/friends";
import { FriendRequestCard } from "../FriendRequestCard/FriendRequestCard";
import { EmptyState } from "@/app/uikit/feedback/EmptyState/EmptyState";
import { useFriendRequestsStore } from "@/app/hooks/friends/useFriendRequestsStore";

export const FriendRequest = () => {
  const t = useTranslations();
  const requests = useFriendRequestsStore((state) => state.requests);
  const setRequests = useFriendRequestsStore((state) => state.setRequests);

  const removeRequest = (requestId: string) => {
    setRequests(requests.filter((r) => r.id !== requestId));
  };

  const acceptRequest = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      removeRequest(requestId);
      toast.success(t("friendRequest.acceptedSuccess"));
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      await rejectFriendRequest(requestId);
      removeRequest(requestId);
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
            onAccept={acceptRequest}
            onReject={rejectRequest}
          />
        ))}
      </ul>
    </section>
  );
};
