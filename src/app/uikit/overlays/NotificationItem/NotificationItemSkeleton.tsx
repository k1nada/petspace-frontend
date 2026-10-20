import { Skeleton, SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { SKELETON_AVATAR } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import styles from "./NotificationItem.module.scss";

interface NotificationItemSkeletonProps {
  messageWidth: string;
}

export const NotificationItemSkeleton = ({
  messageWidth,
}: NotificationItemSkeletonProps) => (
  <li className={styles.item}>
    <div className={styles.avatarWrapper}>
      <Skeleton
        shape="circle"
        width={SKELETON_AVATAR.notification}
        height={SKELETON_AVATAR.notification}
      />
    </div>
    <div className={styles.info}>
      <span className={styles.message}>
        <SkeletonText width={messageWidth} />
      </span>
      <span className={styles.time}>
        <SkeletonText width="30%" />
      </span>
    </div>
  </li>
);
