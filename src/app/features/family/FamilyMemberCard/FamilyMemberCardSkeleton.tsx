import { Skeleton, SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { SKELETON_AVATAR } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import styles from "./FamilyMemberCard.module.scss";
import { DropdownSkeleton } from "@/app/uikit/overlays/Dropdown/DropdownSkeleton";

export const FamilyMemberCardSkeleton = () => (
  <li className={styles.card}>
    <div className={styles.link}>
      <Skeleton
        shape="circle"
        width={SKELETON_AVATAR.familyMember}
        height={SKELETON_AVATAR.familyMember}
      />
      <div className={styles.info}>
        <span className={styles.name}>
          <SkeletonText width={100} />
        </span>
        <span className={styles.breed}>
          <SkeletonText width={70} />
        </span>
      </div>
    </div>
    <div className={styles.menu}>
      <DropdownSkeleton />
    </div>
  </li>
);
