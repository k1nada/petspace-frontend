import { Skeleton } from "@/app/uikit/feedback/Skeleton/Skeleton";
import styles from "./Avatar.module.scss";

interface AvatarSkeletonProps {
  size: number;
  mobileSize?: number;
}

export const AvatarSkeleton = ({ size, mobileSize }: AvatarSkeletonProps) => (
  <div
    className={styles.skeleton}
    style={
      {
        "--avatar-base-size": `${size}px`,
        "--avatar-mobile-size": `${mobileSize ?? size}px`,
      } as React.CSSProperties
    }
  >
    <Skeleton shape="circle" width="100%" height="100%" />
  </div>
);
