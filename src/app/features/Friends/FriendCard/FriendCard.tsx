import styles from "./FriendCard.module.scss";
import { Button } from "@/app/uikit/form/Button/Button";
import { useTranslations } from "next-intl";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { DropdownMenu } from "@/app/uikit/overlays/DropdownMenu/DropdownMenu";
import { MdDeleteSweep } from "react-icons/md";
import { Friend } from "@/types";

interface FriendCardProps {
  friend: Friend;
}

export const FriendCard = ({ friend }: FriendCardProps) => {
  const t = useTranslations();

  const deleteFriend = (username: string) => {
    console.log("delete", username);
  };

  return (
    <li className={styles.card}>
      <Avatar src={friend.avatar} size={90} />
      <div className={styles.right}>
        <div className={styles.name}>{friend.name}</div>
        <Button appearance="tertiary" className={styles.button}>
          {t("friends.message")}
        </Button>
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
