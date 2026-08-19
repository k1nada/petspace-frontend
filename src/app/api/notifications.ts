import api from "@/config/axios";
import { AppNotification } from "@/types";

export const getNotifications = async (
  username: string,
): Promise<AppNotification[]> => {
  const { data } = await api.get<AppNotification[]>(
    `/notifications/${username}`,
  );
  return data;
};

export const markNotificationRead = async (id: string): Promise<void> => {
  await api.post(`/notifications/${id}/read`);
};

export const markAllNotificationsRead = async (
  username: string,
): Promise<void> => {
  await api.post(`/notifications/${username}/read-all`);
};
