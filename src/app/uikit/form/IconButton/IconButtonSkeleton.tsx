import { Skeleton } from "@/app/uikit/feedback/Skeleton/Skeleton";
import styles from "./IconButton.module.scss";

export const IconButtonSkeleton = () => (
  <Skeleton shape="rounded" className={styles.iconButton} />
);
