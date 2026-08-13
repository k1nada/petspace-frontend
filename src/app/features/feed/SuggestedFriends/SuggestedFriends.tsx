"use client";

import styles from "./SuggestedFriends.module.scss";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { Button } from "@/app/uikit/form/Button/Button";
import { MOCK_SUGGESTIONS } from "@/utils/profile";

export const SuggestedFriends = () => {
  const t = useTranslations();
  const [requestedIds, setRequestedIds] = useState<string[]>([]);

  return (
    <div className={styles.container}>
      <span className={styles.title}>{t("suggestedFriends.title")}</span>
      <ul className={styles.list}>
        {MOCK_SUGGESTIONS.map((friend) => (
          <li key={friend.id} className={styles.card}>
            <Avatar src={friend.avatar} size={45} />
            <div className={styles.info}>
              <div className={styles.name}>{friend.name}</div>
              <div className={styles.breed}>{friend.breed}</div>
            </div>
            <Button
              appearance="secondary"
              onClick={() => setRequestedIds([...requestedIds, friend.id])}
            >
              {requestedIds.includes(friend.id)
                ? t("friends.requestSent")
                : t("friends.addFriend")}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
