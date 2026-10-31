"use client";

import styles from "./NotificationItem.module.scss";
import { useLocale, useTranslations } from "next-intl";
import cn from "classnames";
import { FaHeart, FaPaw, FaTrophy, FaComment } from "react-icons/fa";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import dayjs from "@/utils/dayjs";
import { AppNotification, NotificationType } from "@/types";

const NOTIFICATION_ICONS: Record<NotificationType, React.ReactNode> = {
  like: <FaHeart />,
  comment: <FaComment />,
  friendRequest: <FaPaw />,
  achievement: <FaTrophy />,
};

const messageKeys: Record<NotificationType, string> = {
  like: "notifications.liked",
  comment: "notifications.commented",
  friendRequest: "notifications.friendRequest",
  achievement: "notifications.achievement",
};

interface NotificationItemProps {
  notification: AppNotification;
  onRead: (id: string) => void;
  ownAvatar?: string;
}

export const NotificationItem = ({
  notification,
  onRead,
  ownAvatar,
}: NotificationItemProps) => {
  const t = useTranslations();
  const locale = useLocale();

  const getMessage = () =>
    t(messageKeys[notification.type], {
      name: notification.user?.name || notification.user?.username || "",
    });

  const avatarSrc = notification.user ? notification.user.avatar : ownAvatar;

  return (
    <li
      className={cn(styles.item, { [styles.unread]: !notification.read })}
      onClick={() => !notification.read && onRead(notification.id)}
    >
      <div className={styles.avatarWrapper}>
        <Avatar src={avatarSrc} size={40} />
        <span className={cn(styles.icon, styles[notification.type])}>
          {NOTIFICATION_ICONS[notification.type]}
        </span>
      </div>
      <div className={styles.info}>
        <span className={styles.message}>{getMessage()}</span>
        <time className={styles.time}>
          {dayjs(notification.createdAt).locale(locale).fromNow()}
        </time>
      </div>
      {!notification.read && <span className={styles.unreadNotifications} />}
    </li>
  );
};
