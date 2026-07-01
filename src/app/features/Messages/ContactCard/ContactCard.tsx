import { Button } from "@/app/uikit/form/Button/Button";
import styles from "./ContactCard.module.scss";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { useLocale } from "next-intl";
import { formatTime } from "@/utils/dateFormatters";
import { ChatContact } from "@/types";

interface ContactCardProps {
  contact: ChatContact;
  onClick: () => void;
}

export const ContactCard = ({ contact, onClick }: ContactCardProps) => {
  const locale = useLocale();

  return (
    <li className={styles.card}>
      <Button appearance="ghost" className={styles.button} onClick={onClick}>
        <Avatar src={contact.avatar} isOnline={contact.isOnline} />
        <div className={styles.info}>
          <span className={styles.name}>{contact.name}</span>
          <span className={styles.text}>{contact.lastMessage?.text}</span>
        </div>
        <div className={styles.message}>
          <time className={styles.time}>
            {contact.lastMessage?.createdAt &&
              formatTime(contact.lastMessage.createdAt, locale)}
          </time>
          {contact.unreadCount && contact.unreadCount > 0 && (
            <span className={styles.count}>{contact.unreadCount}</span>
          )}
        </div>
      </Button>
    </li>
  );
};
