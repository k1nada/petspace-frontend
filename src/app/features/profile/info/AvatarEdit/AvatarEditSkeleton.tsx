import { Skeleton } from "@/app/uikit/feedback/Skeleton/Skeleton";
import styles from "./AvatarEdit.module.scss";

interface AvatarEditSkeletonProps {
  size: number;
}

export const AvatarEditSkeleton = ({ size }: AvatarEditSkeletonProps) => (
  <div className={styles.wrapper}>
    <div className={styles.avatarWrapper}>
      <Skeleton shape="circle" width={size} height={size} />
    </div>
  </div>
);
