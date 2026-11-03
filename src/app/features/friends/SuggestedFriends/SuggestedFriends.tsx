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

const AVATAR_SIZE = 44;

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
                <Avatar src={friend.avatar} size={AVATAR_SIZE} />
              </Link>
              <div className={styles.info}>
                <div className={styles.name}>
                  {friend.name || friend.username}
                </div>
                {friend.breed && (
                  <div className={styles.breed}>{friend.breed}</div>
                )}
              </div>
              {isPending ? (
                <Button
                  appearance="secondary"
                  className={styles.addButton}
                  title={t("profileBanner.cancelRequest")}
                  onClick={() => cancelRequest(friend.username)}
                  disabled={loadingUsername === friend.username}
                >
                  {t("suggestedFriends.sent")}
                </Button>
              ) : (
                <Button
                  appearance="primary"
                  className={styles.addButton}
                  title={t("common.addFriend")}
                  onClick={() => requestFriend(friend.username)}
                  disabled={loadingUsername === friend.username}
                >
                  {t("suggestedFriends.add")}
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
};
