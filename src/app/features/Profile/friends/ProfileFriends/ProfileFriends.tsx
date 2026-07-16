import Link from "next/link";
import styles from "./ProfileFriends.module.scss";
import { ROUTES } from "@/routes/routes";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { useTranslations } from "next-intl";
import { Friend } from "@/types";
import { ProfileFriendsSkeleton } from "./ProfileFriendsSkeleton";
import { useUserStore } from "@/app/hooks/useUserStore";

interface ProfileFriendsProps {
  username: string;
  friends: Friend[];
}

const MAX_VISIBLE_FRIENDS = 3;

export const ProfileFriends = ({ username, friends }: ProfileFriendsProps) => {
  const t = useTranslations();

  const isLoading = useUserStore((state) => state.isLoading);
  const currentUser = useUserStore((state) => state.currentUser);

  if (isLoading && !currentUser) return <ProfileFriendsSkeleton />;

  const visibleFriends = friends.slice(0, MAX_VISIBLE_FRIENDS);

  return (
    <section className={styles.container}>
      <Link href={ROUTES.friends(username)} className={styles.titleLink}>
        <h3 className={styles.title}>{t("profileFriends.title")}</h3>
        <span className={styles.count}>{friends.length}</span>
      </Link>
      {friends.length === 0 ? (
        <p className={styles.empty}>{t("profileFriends.empty")}</p>
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
                  isOnline={friend.isOnline}
                />
                <div className={styles.name}>{friend.name}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
