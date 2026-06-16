"use client";

import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import styles from "./FriendRequest.module.scss";
import { Button } from "@/app/uikit/form/Button/Button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ROUTES } from "@/routes/routes";
import { toast } from "react-toastify";
import { acceptFriendRequest, rejectFriendRequest } from "@/app/api/friends";
import { useUserStore } from "@/app/hooks/useUserStore";

interface FriendRequestProps {
  currentUser: string;
}

const MAX_VISIBLE_REQUESTS = 3;

export const FriendRequest = ({ currentUser }: FriendRequestProps) => {
  const t = useTranslations();
  const requests = useUserStore((state) => state.requests);
  const setRequests = useUserStore((state) => state.setRequests);
  const isLoading = useUserStore((state) => state.isLoading);

  const acceptRequest = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      setRequests(requests.filter((r) => r.id !== requestId));
      toast.success(t("friendRequest.acceptedSuccess"));
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      await rejectFriendRequest(requestId);
      setRequests(requests.filter((r) => r.id !== requestId));
      toast.success(t("friendRequest.rejectedSuccess"));
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t("friendRequest.title")}</h2>
        <span className={styles.count}>{requests.length}</span>
      </div>
      {requests.length === 0 ? (
        <p className={styles.empty}>{t("friendRequest.empty")}</p>
      ) : (
        <ul className={styles.list}>
          {requests.slice(0, MAX_VISIBLE_REQUESTS).map((request) => (
            <li key={request.id} className={styles.friendRequest}>
              <Link href={ROUTES.profile(request.from.username)}>
                <Avatar
                  src={request.from.avatar}
                  size={70}
                  isOnline={request.from.isOnline}
                />
              </Link>
              <div className={styles.info}>
                <div className={styles.name}>{request.from.name}</div>
                <div className={styles.actions}>
                  <Button
                    appearance="primary"
                    onClick={() => acceptRequest(request.id)}
                    disabled={isLoading}
                  >
                    {t("friendRequest.accept")}
                  </Button>
                  <Button
                    appearance="secondary"
                    onClick={() => rejectRequest(request.id)}
                    disabled={isLoading}
                  >
                    {t("friendRequest.decline")}
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {requests.length > MAX_VISIBLE_REQUESTS && (
        <Link
          href={ROUTES.friendRequests(currentUser)}
          className={styles.viewAll}
        >
          {t("friendRequest.viewAll")}
        </Link>
      )}
    </section>
  );
};
