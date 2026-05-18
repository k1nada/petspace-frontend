import Link from "next/link";
import styles from "./ProfileFriends.module.scss";
import { ROUTES } from "@/routes/routes";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { Friend } from "@/types";
import { useTranslations } from "next-intl";

interface ProfileFriendsProps {
  username: string;
  friends: Friend[];
}

const MAX_VISIBLE_FRIENDS = 3;

export const ProfileFriends = ({ username, friends }: ProfileFriendsProps) => {
  const t = useTranslations();

  return (
    <section className={styles.container}>
      <Link href={ROUTES.friends(username)} className={styles.titleLink}>
        <h3 className={styles.title}>{t("profileFriends.title")}</h3>
      </Link>
      {friends.length === 0 ? (
        <p className={styles.empty}>{t("profileFriends.empty")}</p>
      ) : (
        <>
          <ul className={styles.friends}>
            {friends.slice(0, MAX_VISIBLE_FRIENDS).map((friend) => (
              <li key={friend.username} className={styles.friend}>
                <Avatar
                  src={friend.avatar}
                  size={45}
                  isOnline={friend.isOnline}
                />
                <div className={styles.info}>
                  <div className={styles.name}>{friend.name}</div>
                  <div className={styles.breed}>{friend.breed}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.action}>
            <Link
              href={ROUTES.friends(username)}
              className={styles.showFriends}
            >
              {t("profileFriends.showFriends")}
            </Link>
          </div>
        </>
      )}
    </section>
  );
};
