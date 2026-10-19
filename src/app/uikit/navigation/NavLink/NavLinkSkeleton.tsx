import { ReactNode } from "react";
import styles from "./NavLink.module.scss";

interface NavLinkSkeletonProps {
  children: ReactNode;
}

export const NavLinkSkeleton = ({ children }: NavLinkSkeletonProps) => (
  <div className={styles.navLink}>{children}</div>
);
