import styles from "./FamilyColumnSkeleton.module.scss";
import { FamilyMemberCardSkeleton } from "@/app/features/family/FamilyMemberCard/FamilyMemberCardSkeleton";

const MEMBERS_COUNT = 2;

export const FamilyColumnSkeleton = () => (
  <div className={styles.column}>
    <div className={styles.title} />
    <ul className={styles.list}>
      {Array.from({ length: MEMBERS_COUNT }, (_, i) => (
        <FamilyMemberCardSkeleton key={i} />
      ))}
    </ul>
  </div>
);
