import { AppNotification } from "@/types";

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60 * 1000);

export const mockNotifications: AppNotification[] = [
  {
    id: "1",
    type: "friendRequest",
    user: { name: "Bella" },
    createdAt: minutesAgo(4),
    read: false,
  },
  {
    id: "2",
    type: "like",
    user: { name: "Max" },
    createdAt: minutesAgo(26),
    read: false,
  },
  {
    id: "3",
    type: "comment",
    user: { name: "Luna" },
    createdAt: minutesAgo(48),
    read: false,
  },
  {
    id: "4",
    type: "achievement",
    createdAt: minutesAgo(120),
    read: false,
  },
  {
    id: "6",
    type: "like",
    user: { name: "Daisy" },
    createdAt: minutesAgo(1440),
    read: true,
  },
];
