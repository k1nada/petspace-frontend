import { Button } from "@/app/uikit/form/Button/Button";
import styles from "./ConversationCard.module.scss";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { Friend } from "@/types";

interface ConversationCardProps {
  friend: Friend;
  onClick: () => void;
}

export const ConversationCard = ({
  friend,
  onClick,
}: ConversationCardProps) => (
  <li className={styles.card}>
    <Button appearance="ghost" className={styles.button} onClick={onClick}>
      <Avatar src={friend.avatar} isOnline={friend.isOnline}/>
      <div className={styles.info}>
        <span className={styles.name}>{friend.name}</span>
        <span className={styles.text}>hi</span>
      </div>
      <div className={styles.message}>
        <span className={styles.time}>14 min</span>
        <span className={styles.count}>2</span>
      </div>
    </Button>
  </li>
);
