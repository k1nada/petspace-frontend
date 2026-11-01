import { SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
import { FamilyMiniCardSkeleton } from "../FamilyMiniCard/FamilyMiniCardSkeleton";
import styles from "./FamilyGrid.module.scss";

interface FamilyGridSkeletonProps {
  title: string;
}

export const FamilyGridSkeleton = ({ title }: FamilyGridSkeletonProps) => (
  <div className={styles.section}>
    <CardTitle>
      <SkeletonText>{title}</SkeletonText>
    </CardTitle>
    <ul className={styles.grid}>
      <FamilyMiniCardSkeleton />
      <FamilyMiniCardSkeleton />
    </ul>
  </div>
);
