import { Skeleton, SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { SKELETON_AVATAR } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import styles from "./FamilyMiniCard.module.scss";

export const FamilyMiniCardSkeleton = () => (
  <li className={styles.card}>
    <div className={styles.link}>
      <Skeleton
        shape="circle"
        width={SKELETON_AVATAR.familyMini}
        height={SKELETON_AVATAR.familyMini}
      />
      <span className={styles.name}>
        <SkeletonText width={64} />
      </span>
      <span className={styles.breed}>
        <SkeletonText width={48} />
      </span>
    </div>
  </li>
);
