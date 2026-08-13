"use client";

import styles from "./NotificationsDropdown.module.scss";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { BsBellFill } from "react-icons/bs";
import { FaHeart, FaUserPlus, FaTrophy } from "react-icons/fa";
import { FaComment } from "react-icons/fa6";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { EmptyState } from "@/app/uikit/feedback/EmptyState/EmptyState";
import dayjs from "@/utils/dayjs";
import { AppNotification, NotificationType } from "@/types";
import { mockNotifications } from "./mockNotifications";
import { Button } from "../../form/Button/Button";

const typeIcons: Record<NotificationType, React.ReactNode> = {
  like: <FaHeart />,
  comment: <FaComment />,
  friendRequest: <FaUserPlus />,
  achievement: <FaTrophy />,
};

export const NotificationsDropdown = () => {
  const t = useTranslations();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<AppNotification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const getMessage = (notification: AppNotification) => {
    const name = notification.user?.name ?? "";
    switch (notification.type) {
      case "like":
        return t("notifications.liked", { name });
      case "comment":
        return t("notifications.commented", { name });
      case "friendRequest":
        return t("notifications.friendRequest", { name });
      case "achievement":
        return t("notifications.achievement");
    }
  };

  return (
    <div className={styles.wrapper}>
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      )}
      <Button
        appearance="ghost"
        className={styles.trigger}
        onClick={() => setIsOpen((open) => !open)}
      >
        <BsBellFill size={20} />
        {unreadCount > 0 && (
          <span className={styles.badge}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <span className={styles.title}>{t("notifications.title")}</span>
            {unreadCount > 0 && (
              <Button
                appearance="ghost"
                className={styles.markAllRead}
                onClick={markAllAsRead}
              >
                {t("notifications.markAllRead")}
              </Button>
            )}
          </div>

          {notifications.length === 0 ? (
            <EmptyState text={t("notifications.empty")} compact />
          ) : (
            <ul className={styles.list}>
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`${styles.item} ${
                    !notification.read ? styles.unread : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={styles.avatarWrapper}>
                    <Avatar src={notification.user?.avatar} size={40} />
                    <span
                      className={`${styles.typeIcon} ${
                        styles[notification.type]
                      }`}
                    >
                      {typeIcons[notification.type]}
                    </span>
                  </div>
                  <div className={styles.info}>
                    <span className={styles.message}>
                      {getMessage(notification)}
                    </span>
                    <time className={styles.time}>
                      {dayjs(notification.createdAt).locale(locale).fromNow()}
                    </time>
                  </div>
                  {!notification.read && (
                    <span className={styles.dot} aria-hidden />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
