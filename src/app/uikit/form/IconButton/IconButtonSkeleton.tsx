import cn from "classnames";
import { Skeleton } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { SKELETON_ICON } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import styles from "./IconButton.module.scss";

export const IconButtonSkeleton = () => (
  <>
    <Skeleton
      shape="rounded"
      className={cn(styles.iconButton, styles.skeletonSquare)}
    />
    <span className={cn(styles.iconButton, styles.skeletonBox)}>
      <Skeleton
        shape="circle"
        width={SKELETON_ICON.quietButton}
        height={SKELETON_ICON.quietButton}
      />
    </span>
  </>
);
