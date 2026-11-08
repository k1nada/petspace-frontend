import { ReactNode } from "react";
import cn from "classnames";
import styles from "./NavLink.module.scss";

interface NavLinkSkeletonProps {
  children: ReactNode;
  className?: string;
}

export const NavLinkSkeleton = ({
  children,
  className,
}: NavLinkSkeletonProps) => (
  <div className={cn(styles.navLink, className)}>{children}</div>
);
