import { ReactNode } from "react";
import cn from "classnames";
import { Link } from "@/i18n/navigation";
import styles from "./NavLink.module.scss";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  count?: number;
  className?: string;
  onClick?: () => void;
}

export const NavLink = ({
  href,
  children,
  count,
  className,
  onClick,
}: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(styles.navLink, className)}
      onClick={onClick}
    >
      {children}
      {count ? (
        <span className={styles.counter}>{count > 99 ? "99+" : count}</span>
      ) : null}
    </Link>
  );
};
