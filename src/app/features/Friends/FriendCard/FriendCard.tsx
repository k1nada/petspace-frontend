import styles from "./FriendCard.module.scss";
import { Button } from "@/app/uikit/form/Button/Button";
import { Friend } from "@/types";
import { useTranslations } from "next-intl";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";

interface FriendCardProps {
  friend: Friend;
}

export const FriendCard = ({ friend }: FriendCardProps) => {
  const t = useTranslations();

  return (
    <li className={styles.card}>
      <Avatar src={friend.avatar} size={70} />
      <div className={styles.right}>
        <div className={styles.name}>{friend.name}</div>
        <Button appearance="tertiary" className={styles.button}>
          {t("friends.message")}
        </Button>
      </div>
    </li>
  );
};
