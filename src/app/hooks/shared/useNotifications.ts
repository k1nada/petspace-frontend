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

  useEffect(() => {
    if (!currentUser) return;

    const loadNotifications = async () => {
      try {
        const data = await getNotifications(currentUser.username);
        setNotifications(data);
      } catch {
        setNotifications([]);
      }
      setLoading(false);
    };

    loadNotifications();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const handleNotification = (notification: AppNotification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("notification", handleNotification);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [currentUser]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    if (!currentUser) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await markAllNotificationsRead(currentUser.username);
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        return { ...n, read: true };
      }),
    );
    try {
      await markNotificationRead(id);
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  return { notifications, unreadCount, loading, markAllAsRead, markAsRead };
};
