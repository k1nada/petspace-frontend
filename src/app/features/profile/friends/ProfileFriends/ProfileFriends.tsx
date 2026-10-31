"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import styles from "./ProfileFriends.module.scss";
import { ROUTES } from "@/routes/routes";
import { Card } from "@/app/uikit/layout/Card/Card";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { useTranslations } from "next-intl";
import { Friend } from "@/types";
import { usePresenceStore } from "@/app/hooks/shared/usePresenceStore";

interface ProfileFriendsProps {
  username: string;
  friends: Friend[];
}

const MAX_VISIBLE_FRIENDS = 8;

export const ProfileFriends = ({ username, friends }: ProfileFriendsProps) => {
  const t = useTranslations();
  const presenceByUserId = usePresenceStore((state) => state.presenceByUserId);
  useEffect(() => {
    const store = usePresenceStore.getState();
    for (const friend of friends) {
      if (store.presenceByUserId[friend.id]) continue;
      store.setPresence(friend.id, {
        isOnline: friend.isOnline ?? false,
        lastSeen: friend.lastSeen,
      });
    }
  }, [friends]);

  const visibleFriends = friends.slice(0, MAX_VISIBLE_FRIENDS);

  return (
    <Card as="section">
      <Link href={ROUTES.friends(username)} className={styles.titleLink}>
        <CardTitle count={friends.length}>{t("common.friends")}</CardTitle>
      </Link>
      {friends.length === 0 ? (
        <p className={styles.empty}>{t("common.noFriendsYet")}</p>
      ) : (
        <ul className={styles.friends}>
          {visibleFriends.map((friend) => (
            <li key={friend.username}>
              <Link
                href={ROUTES.profile(friend.username)}
                className={styles.friend}
              >
                <Avatar
                  src={friend.avatar}
                  size={70}
                  isOnline={
                    presenceByUserId[friend.id]?.isOnline ?? friend.isOnline
                  }
                />
                <div className={styles.name}>
                  {friend.name || friend.username}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
