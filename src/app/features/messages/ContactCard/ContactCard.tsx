"use client";

import cn from "classnames";
import { Button } from "@/app/uikit/form/Button/Button";
import styles from "./ContactCard.module.scss";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { useLocale, useTranslations } from "next-intl";
import { formatTime } from "@/utils/dateFormatters";
import { ChatContact } from "@/types";
import { useUserPresence } from "@/app/hooks/shared/useUserPresence";

interface ContactCardProps {
  contact: ChatContact;
  isActive?: boolean;
  onClick: () => void;
}

export const ContactCard = ({
  contact,
  isActive,
  onClick,
}: ContactCardProps) => {
  const locale = useLocale();
  const t = useTranslations();
  const { isOnline } = useUserPresence(contact);

  const lastMessageText = contact.lastMessage
    ? contact.lastMessage.text ||
      (contact.lastMessage.hasPost ? t("contactList.sharedPost") : "")
    : "";

  return (
    <li className={styles.card}>
      <Button
        appearance="ghost"
        className={cn(styles.button, { [styles.active]: isActive })}
        onClick={onClick}
      >
        <Avatar src={contact.avatar} isOnline={isOnline} />
        <div className={styles.info}>
          <span className={styles.name}>{contact.name}</span>
          <span className={styles.text}>{lastMessageText}</span>
        </div>
        <div className={styles.message}>
          <time className={styles.time}>
            {contact.lastMessage?.createdAt &&
              formatTime(contact.lastMessage.createdAt, locale)}
          </time>
          {(contact.unreadCount ?? 0) > 0 && (
            <span className={styles.count}>{contact.unreadCount}</span>
          )}
        </div>
      </Button>
    </li>
  );
};
