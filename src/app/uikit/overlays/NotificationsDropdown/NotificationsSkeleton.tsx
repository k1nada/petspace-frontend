import { NotificationItemSkeleton } from "@/app/uikit/overlays/NotificationItem/NotificationItemSkeleton";
import styles from "./NotificationsDropdown.module.scss";

const MESSAGE_WIDTHS = ["80%", "65%", "75%"];

export const NotificationsSkeleton = () => (
  <ul className={styles.list}>
    {MESSAGE_WIDTHS.map((width, i) => (
      <NotificationItemSkeleton key={i} messageWidth={width} />
    ))}
  </ul>
);
