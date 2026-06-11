"use client";

import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import styles from "./FriendRequest.module.scss";
import { Button } from "@/app/uikit/form/Button/Button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ROUTES } from "@/routes/routes";
import { Friend } from "@/types";

interface FriendRequestProps {
  requests?: Friend[];
  currentUser: string;
}

const MAX_VISIBLE_REQUESTS = 3;

export const FriendRequest = ({ requests = [], currentUser }: FriendRequestProps) => {
  const t = useTranslations();

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
            <li key={request.username} className={styles.friendRequest}>
              <Link href={ROUTES.profile(request.username)}>
                <Avatar
                  src={request.avatar}
                  size={70}
                  isOnline={request.isOnline}
                />
              </Link>
              <div className={styles.info}>
                <div className={styles.name}>{request.name}</div>
                <div className={styles.actions}>
                  <Button appearance="primary">
                    {t("friendRequest.accept")}
                  </Button>
                  <Button appearance="secondary">
                    {t("friendRequest.decline")}
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {requests.length > MAX_VISIBLE_REQUESTS && (
        <Link href={ROUTES.friendRequests(currentUser)} className={styles.viewAll}>
          {t("friendRequest.viewAll")}
        </Link>
      )}
    </section>
  );
};
