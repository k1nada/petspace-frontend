import { useEffect, useState } from "react";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/app/api/notifications";
import { AppNotification, User } from "@/types";
import socket from "@/services/socket";

export const useNotifications = (currentUser: User | null) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    getNotifications(currentUser.username).then((data) => {
      setNotifications(data);
      setLoading(false);
    });
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
    await markAllNotificationsRead(currentUser.username);
  };

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        return { ...n, read: true };
      }),
    );
    await markNotificationRead(id);
  };

  return { notifications, unreadCount, loading, markAllAsRead, markAsRead };
};
