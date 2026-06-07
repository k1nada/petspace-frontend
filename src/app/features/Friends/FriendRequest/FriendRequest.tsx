"use client";

import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import styles from "./FriendRequest.module.scss";
import { Button } from "@/app/uikit/form/Button/Button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ROUTES } from "@/routes/routes";
import { Friend } from "@/types";

interface FriendRequestProps {
  friends?: Friend[];
}

const MAX_VISIBLE_REQUERSTS = 3;

export const FriendRequest = ({ friends = [] }: FriendRequestProps) => {
  const t = useTranslations();

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t("friendRequest.title")}</h2>
        <span className={styles.count}>{friends.length}</span>
      </div>
      {friends.length === 0 ? (
        <p className={styles.empty}>{t("friendRequest.empty")}</p>
      ) : (
        <ul className={styles.list}>
          {friends.slice(0, MAX_VISIBLE_REQUERSTS).map((friend) => (
            <li key={friend.username} className={styles.friendRequest}>
              <Link href={ROUTES.profile(friend.username)}>
                <Avatar src={friend.avatar} size={70} isOnline={friend.isOnline}/>
              </Link>
              <div className={styles.info}>
                <div className={styles.name}>{friend.name}</div>
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
    </section>
  );
};
