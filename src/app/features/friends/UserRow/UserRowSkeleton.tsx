import { Skeleton, SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { SKELETON_AVATAR } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import { IconButtonSkeleton } from "@/app/uikit/form/IconButton/IconButtonSkeleton";
import styles from "./UserRow.module.scss";

interface UserRowSkeletonProps {
  nameWidth: string;
}

export const UserRowSkeleton = ({ nameWidth }: UserRowSkeletonProps) => (
  <li className={styles.row}>
    <Skeleton
      shape="circle"
      width={SKELETON_AVATAR.friendRow}
      height={SKELETON_AVATAR.friendRow}
    />

    <div className={styles.info}>
      <span className={styles.name}>
        <SkeletonText width={nameWidth} />
      </span>
      <span className={styles.status}>
        <SkeletonText width="30%" />
      </span>
    </div>

    <div className={styles.actions}>
      <IconButtonSkeleton />
      <IconButtonSkeleton />
    </div>
  </li>
);
