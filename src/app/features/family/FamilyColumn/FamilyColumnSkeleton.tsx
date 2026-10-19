import { Skeleton, SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { Button } from "@/app/uikit/form/Button/Button";
import styles from "./FamilyColumn.module.scss";
import { FamilyMemberCardSkeleton } from "@/app/features/family/FamilyMemberCard/FamilyMemberCardSkeleton";

interface FamilyColumnSkeletonProps {
  title: string;
  addLabel: string;
}

export const FamilyColumnSkeleton = ({
  title,
  addLabel,
}: FamilyColumnSkeletonProps) => (
  <div className={styles.column}>
    <h2 className={styles.title}>
      <SkeletonText>{title}</SkeletonText>
    </h2>

    <ul className={styles.list}>
      <FamilyMemberCardSkeleton />
      <FamilyMemberCardSkeleton />
    </ul>

    <Skeleton shape="rounded" width="100%">
      <Button appearance="secondary">{addLabel}</Button>
    </Skeleton>
  </div>
);
