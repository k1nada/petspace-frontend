"use client";

import styles from "./NotificationsDropdown.module.scss";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { BsBellFill } from "react-icons/bs";
import { EmptyState } from "@/app/uikit/feedback/EmptyState/EmptyState";
import { Button } from "../../form/Button/Button";
import { useAuthStore } from "@/app/hooks/useAuthStore";
import { useNotifications } from "@/app/hooks/useNotifications";
import { NotificationItem } from "@/app/uikit/overlays/NotificationItem/NotificationItem";

export const NotificationsDropdown = () => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = useAuthStore((state) => state.currentUser);
  const { notifications, unreadCount, markAllAsRead, markAsRead } =
    useNotifications(currentUser);

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
          <span className={styles.counter}>
            {unreadCount > 99 ? "99+" : unreadCount}
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
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
