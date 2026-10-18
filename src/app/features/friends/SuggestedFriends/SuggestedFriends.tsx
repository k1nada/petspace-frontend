"use client";

import styles from "./SuggestedFriends.module.scss";
import { useTranslations } from "next-intl";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { Button } from "@/app/uikit/form/Button/Button";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { ROUTES } from "@/routes/routes";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { useSuggestedFriends } from "@/app/hooks/friends/useSuggestedFriends";
import { getRelationshipStatus } from "@/utils/friends";
import { SuggestedFriendsSkeleton } from "./SuggestedFriendsSkeleton";

interface SuggestedFriendsProps {
  profileUsername?: string;
}

export const SuggestedFriends = ({
  profileUsername,
}: SuggestedFriendsProps) => {
  const t = useTranslations();
  const currentUser = useAuthStore((state) => state.currentUser);
  const { suggestions, requestedIds, loading, requestFriend, cancelRequest } =
    useSuggestedFriends(currentUser);

  if (
    profileUsername &&
    currentUser &&
    currentUser.username !== profileUsername
  ) {
    return null;
  }

  if (loading) return <SuggestedFriendsSkeleton />;
  if (!suggestions.length) return null;

  return (
    <div className={styles.container}>
      <span className={styles.title}>{t("suggestedFriends.title")}</span>
      <ul className={styles.list}>
        {suggestions.map((friend) => {
          const isPending =
            requestedIds.includes(friend.username) ||
            getRelationshipStatus(currentUser, friend.id).isPending;

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
    </div>
  );
};
