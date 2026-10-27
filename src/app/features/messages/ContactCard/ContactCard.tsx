"use client";

import cn from "classnames";
import { Button } from "@/app/uikit/form/Button/Button";
import styles from "./ContactCard.module.scss";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { useLocale, useTranslations } from "next-intl";
import { formatChatListDate } from "@/utils/dateFormatters";
import { ChatContact } from "@/types";
import { useUserPresence } from "@/app/hooks/shared/useUserPresence";

interface ContactCardProps {
  contact: ChatContact;
  isActive?: boolean;
  onClick: () => void;
  onHover?: () => void;
}

export const ContactCard = ({
  contact,
  isActive,
  onClick,
  onHover,
}: ContactCardProps) => {
  const locale = useLocale();
  const t = useTranslations();
  const { isOnline } = useUserPresence(contact);

  let lastMessageText = contact.lastMessage?.text ?? "";
  if (!lastMessageText && contact.lastMessage?.hasPost) {
    lastMessageText = t("contactList.sharedPost");
  }
  if (!lastMessageText && contact.lastMessage?.hasPhoto) {
    lastMessageText = t("contactList.sharedPhoto");
  }

  return (
    <li className={styles.card}>
      <Button
        appearance="ghost"
        className={cn(styles.button, { [styles.active]: isActive })}
        onClick={onClick}
        onMouseEnter={onHover}
      >
        <Avatar src={contact.avatar} isOnline={isOnline} />
        <div className={styles.info}>
          <span className={styles.name}>{contact.name}</span>
          <span className={styles.text}>{lastMessageText}</span>
        </div>
        <div className={styles.message}>
          <time className={styles.time}>
            {contact.lastMessage?.createdAt &&
              formatChatListDate(
                contact.lastMessage.createdAt,
                locale,
                t("dates.yesterday"),
              )}
          </time>
          {(contact.unreadCount ?? 0) > 0 && (
            <span className={styles.count}>{contact.unreadCount}</span>
          )}
        </div>
      </Button>
    </li>
  );
};
