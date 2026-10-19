import { Skeleton } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { SKELETON_ICON } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import styles from "./NotificationsDropdown.module.scss";

export const NotificationsTriggerSkeleton = () => (
  <div className={styles.wrapper}>
    <div className={styles.trigger}>
      <Skeleton
        shape="circle"
        width={SKELETON_ICON.navigation}
        height={SKELETON_ICON.navigation}
      />
    </div>
  </div>
);
