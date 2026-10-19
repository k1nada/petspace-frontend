"use client";

import { useTranslations } from "next-intl";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { Button } from "@/app/uikit/form/Button/Button";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { Card } from "@/app/uikit/layout/Card/Card";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
import { ROUTES } from "@/routes/routes";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { useSuggestedFriends } from "@/app/hooks/friends/useSuggestedFriends";
import { getRelationshipStatus } from "@/utils/friends";
import styles from "./SuggestedFriends.module.scss";

export const SuggestedFriends = () => {
  const t = useTranslations();
  const currentUser = useAuthStore((state) => state.currentUser);
  const { suggestions, loadingUsername, requestFriend, cancelRequest } =
    useSuggestedFriends(currentUser);

  if (!suggestions.length) return null;

  return (
    <Card as="section">
      <CardTitle>{t("suggestedFriends.title")}</CardTitle>
      <ul className={styles.list}>
        {suggestions.map((friend) => {
          const { isPending } = getRelationshipStatus(currentUser, friend.id);

          return (
            <li key={friend.username} className={styles.card}>
              <Link href={ROUTES.profile(friend.username)}>
                <Avatar src={friend.avatar} size={45} />
              </Link>
              <div className={styles.info}>
                <div className={styles.name}>{friend.name}</div>
                <div className={styles.breed}>{friend.breed}</div>
              </div>
              <Button
                className={styles.button}
                appearance={isPending ? "secondary" : "primary"}
                disabled={loadingUsername === friend.username}
                onClick={() =>
                  isPending
                    ? cancelRequest(friend.username)
                    : requestFriend(friend.username)
                }
              >
                {isPending ? t("friends.sent") : t("common.addFriend")}
              </Button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};
