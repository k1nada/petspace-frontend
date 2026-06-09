import { Button } from "@/app/uikit/form/Button/Button";
import styles from "./ContactCard.module.scss";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { ChatContact } from "@/types";

interface ContactCardProps {
  contact: ChatContact;
  onClick: () => void;
}

const formatTime = (createdAt: string | undefined) => {
  if (!createdAt) return "";
  return new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const ContactCard = ({
  contact,
  onClick,
}: ContactCardProps) => (
  <li className={styles.card}>
    <Button appearance="ghost" className={styles.button} onClick={onClick}>
      <Avatar src={contact.avatar} isOnline={contact.isOnline} />
      <div className={styles.info}>
        <span className={styles.name}>{contact.name}</span>
        <span className={styles.text}>{contact.lastMessage?.text}</span>
      </div>
      <div className={styles.message}>
        <span className={styles.time}>
          {formatTime(contact.lastMessage?.createdAt)}
        </span>
        {contact.unreadCount && contact.unreadCount > 0 && (
          <span className={styles.count}>{contact.unreadCount}</span>
        )}
      </div>
    </Button>
  </li>
);
