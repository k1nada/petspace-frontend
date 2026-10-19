import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/api/notifications";
import { AppNotification, User } from "@/types";
import socket from "@/services/socket";

export const useNotifications = (currentUser: User | null) => {
  const t = useTranslations();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const username = currentUser?.username;

  useEffect(() => {
    if (!username) return;
    let cancelled = false;

    const loadNotifications = async () => {
      try {
        const data = await getNotifications(username);
        if (!cancelled) setNotifications(data);
      } catch {
        if (cancelled) return;
        setNotifications([]);
        toast.error(t("toasts.error"));
      }
      if (!cancelled) setLoading(false);
    };

    loadNotifications();
    return () => {
      cancelled = true;
    };
  }, [username, t]);

  useEffect(() => {
    if (!username) return;

    const handleNotification = (notification: AppNotification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("notification", handleNotification);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [username]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    if (!currentUser) return;
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await markAllNotificationsRead(currentUser.username);
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (unreadIds.includes(n.id) ? { ...n, read: false } : n)),
      );
      toast.error(t("toasts.error"));
    }
  };

  const setNotificationRead = (id: string, read: boolean) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read } : n)),
    );
  };

  const markAsRead = async (id: string) => {
    setNotificationRead(id, true);
    try {
      await markNotificationRead(id);
    } catch {
      setNotificationRead(id, false);
      toast.error(t("toasts.error"));
    }
  };

  return { notifications, unreadCount, loading, markAllAsRead, markAsRead };
};
