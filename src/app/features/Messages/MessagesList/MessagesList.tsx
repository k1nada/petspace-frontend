"use client";

import { useTranslations } from "next-intl";
import styles from "./MessagesList.module.scss";
import { SearchBar } from "@/app/uikit/navigation/SearchBar/SearchBar";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { Friend, User } from "@/types";
import { Button } from "@/app/uikit/form/Button/Button";
import { ROUTES } from "@/routes/routes";
import { useRouter } from "next/navigation";

interface MessagesListProps {
  friends: Friend[];
  user: User;
}

export const MessagesList = ({ friends = [], user }: MessagesListProps) => {
  const t = useTranslations();
  const router = useRouter();

  const findFriends = () => {
    router.push(ROUTES.friends(user.username));
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t("messages.title")}</h1>
          <span className={styles.count}>0</span>
        </div>
        <SearchBar />
      </div>
      <ul className={styles.list}>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <li key={friend.id} className={styles.card}>
              <div className={styles.avatar}>
                <Avatar src={friend.avatar}></Avatar>
              </div>
              <div className={styles.info}>
                <span className={styles.name}>{friend.name}</span>
                <span className={styles.text}>hi</span>
              </div>
              <div className={styles.message}>
                <span className={styles.time}>14 min</span>
                <div className={styles.count}>2</div>
              </div>
            </li>
          ))
        ) : (
          <div className={styles.emptyMessages}>
            <p className={styles.emptyText}>
              {t("messages.emptyTitle")}
              <br />
              {t("messages.emptyText")}
            </p>
            <div>
              <Button appearance="primary" onClick={findFriends}>
                Find friends
              </Button>
            </div>
          </div>
        )}
      </ul>
    </div>
  );
};
