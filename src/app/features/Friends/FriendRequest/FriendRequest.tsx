"use client";

import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import styles from "./FriendRequest.module.scss";
import { Button } from "@/app/uikit/form/Button/Button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Friend } from "@/types";
import { ROUTES } from "@/routes/routes";

interface FriendRequestProps {
  friends?: Friend[];
}

export const FriendRequest = ({ friends = [] }: FriendRequestProps) => {
  const t = useTranslations();

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{t("friendRequest.title")}</h2>
      {friends.length === 0 ? (
        <p className={styles.empty}>{t("friendRequest.empty")}</p>
      ) : (
        <ul className={styles.list}>
          {friends.map((friend) => (
            <li key={friend.username} className={styles.friendRequest}>
              <div className={styles.top}>
                <div className={styles.avatar}>
                  <Link
                    href={ROUTES.profile(friend.username)}
                    className={styles.link}
                  >
                    <Avatar src={friend.avatar} size={50} />
                  </Link>
                </div>
                <div className={styles.content}>
                  <div className={styles.name}>{friend.name}</div>
                  <div className={styles.mutualFriends}>
                    {t("friendRequest.mutualFriends", { count: 5 })}
                  </div>
                </div>
              </div>
              <div className={styles.actions}>
                <Button appearance="primary">
                  {t("friendRequest.accept")}
                </Button>
                <Button appearance="tertiary">
                  {t("friendRequest.decline")}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
