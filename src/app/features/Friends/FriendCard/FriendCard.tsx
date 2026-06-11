"use client";

import styles from "./FriendCard.module.scss";
import { Button } from "@/app/uikit/form/Button/Button";
import { useTranslations } from "next-intl";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { DropdownMenu } from "@/app/uikit/overlays/DropdownMenu/DropdownMenu";
import { MdDeleteSweep } from "react-icons/md";
import { Friend } from "@/types";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { ROUTES } from "@/routes/routes";

interface FriendCardProps {
  friend: Friend;
  currentUser: string;
  onFriendDeleted?: (friendUsername: string) => void;
}

export const FriendCard = ({
  friend,
  currentUser,
  onFriendDeleted,
}: FriendCardProps) => {
  const t = useTranslations();

  const deleteFriend = (friendUsername: string) => {
    fetch(`/api/friends/${friendUsername}`, { method: "DELETE" });
    onFriendDeleted?.(friendUsername);
  };

  return (
    <li className={styles.card}>
      <Link href={ROUTES.profile(friend.username)}>
        <Avatar src={friend.avatar} size={90} isOnline={friend.isOnline} />
      </Link>
      <div className={styles.right}>
        <Link href={ROUTES.profile(friend.username)}>
          <div className={styles.name}>{friend.name}</div>
        </Link>
        <Link href={ROUTES.messages(currentUser, friend.username)}>
          <Button appearance="tertiary" className={styles.button}>
            {t("friends.message")}
          </Button>
        </Link>
      </div>
      <DropdownMenu
        items={[
          {
            label: t("friends.delete"),
            onClick: () => deleteFriend(friend.username),
            icon: <MdDeleteSweep size={20} />,
          },
        ]}
      />
    </li>
  );
};
