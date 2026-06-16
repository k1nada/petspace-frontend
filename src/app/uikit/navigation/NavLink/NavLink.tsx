import Link from "next/link";
import styles from "./NavLink.module.scss";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  count?: number;
}

export const NavLink = ({ href, children, count }: NavLinkProps) => {
  return (
    <Link href={href} className={styles.navLink}>
      {children}
      {count ? <span className={styles.counter}>{count}</span> : null}
    </Link>
  );
};