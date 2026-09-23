import Link from "next/link";
import styles from "./NavLink.module.scss";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  count?: number;
  onClick?: () => void;
}

export const NavLink = ({ href, children, count, onClick }: NavLinkProps) => {
  return (
    <Link href={href} className={styles.navLink} onClick={onClick}>
      {children}
      {count ? (
        <span className={styles.counter}>{count > 99 ? "99+" : count}</span>
      ) : null}
    </Link>
  );
};
