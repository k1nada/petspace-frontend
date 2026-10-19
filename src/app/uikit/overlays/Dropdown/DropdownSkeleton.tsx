import { Skeleton } from "@/app/uikit/feedback/Skeleton/Skeleton";
import styles from "./Dropdown.module.scss";

interface DropdownSkeletonProps {
  iconSize?: number;
}

export const DropdownSkeleton = ({ iconSize }: DropdownSkeletonProps) => {
  if (!iconSize) {
    return <Skeleton shape="circle" className={styles.trigger} />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.trigger}>
        <Skeleton shape="circle" width={iconSize} height={iconSize} />
      </div>
    </div>
  );
};
