import { ReactNode } from "react";
import cn from "classnames";
import styles from "./Skeleton.module.scss";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  shape?: "rect" | "rounded" | "circle";
  className?: string;
  children?: ReactNode;
}

export const Skeleton = ({
  width,
  height,
  shape = "rect",
  className,
  children,
}: SkeletonProps) => (
  <div
    className={cn(
      styles.skeleton,
      styles[shape],
      { [styles.sizer]: children },
      className,
    )}
    style={{ width, height }}
  >
    {children}
  </div>
);

interface SkeletonTextProps {
  width?: number | string;
  children?: ReactNode;
}

export const SkeletonText = ({ width, children }: SkeletonTextProps) => {
  if (children !== undefined) {
    return (
      <span className={cn(styles.skeleton, styles.hiddenText)}>{children}</span>
    );
  }

  return (
    <span className={cn(styles.skeleton, styles.text)} style={{ width }}>
      {" "}
    </span>
  );
};
