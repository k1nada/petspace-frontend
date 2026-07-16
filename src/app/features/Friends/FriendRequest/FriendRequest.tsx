"use client";

import styles from "./FriendRequest.module.scss";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { acceptFriendRequest, rejectFriendRequest } from "@/app/api/friends";
import { FriendRequestCard } from "../FriendRequestCard/FriendRequestCard";
import { useUserStore } from "@/app/hooks/useUserStore";

export const FriendRequest = () => {
  const t = useTranslations();
  const requests = useUserStore((state) => state.requests);
  const setRequests = useUserStore((state) => state.setRequests);

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
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>{t("friendRequest.title")}</p>
        <p className={styles.emptyText}>{t("friendRequest.empty")}</p>
      </div>
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
