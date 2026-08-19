import { FaHeart, FaPaw, FaTrophy, FaComment } from "react-icons/fa";
import { NotificationType } from "@/types";

export const NOTIFICATION_ICONS: Record<NotificationType, React.ReactNode> = {
  like: <FaHeart />,
  comment: <FaComment />,
  friendRequest: <FaPaw />,
  achievement: <FaTrophy />,
};
