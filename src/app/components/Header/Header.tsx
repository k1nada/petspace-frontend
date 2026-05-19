"use client";

import { Logo } from "../../uikit/brand/Logo/Logo";
import styles from "./Header.module.scss";
import { Link } from "../../uikit/navigation/Link/Link";
import { ROUTES } from "@/routes/routes";
import { IoHomeSharp } from "react-icons/io5";
import { BsBellFill } from "react-icons/bs";
import { BiSolidMessage } from "react-icons/bi";
import { SearchBar } from "../../uikit/navigation/SearchBar/SearchBar";
import { ThemeToggle } from "@/app/uikit/brand/ThemeToggle/ThemeToggle";
import { useUserStore } from "@/app/hooks/useUserStore";
import { LocaleSwitcher } from "@/app/uikit/brand/LocaleSwitcher/LocaleSwitcher";

export const Header = () => {
  const currentUser = useUserStore((state) => state.currentUser);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <Link href={ROUTES.feed} className={styles.logo}>
            <Logo />
            <span className={styles.logoTitle}>Petspace</span>
          </Link>
        </div>
        {currentUser && (
          <>
            <SearchBar />
            <nav className={styles.actions}>
              <LocaleSwitcher className={styles.iconLink} />
              <ThemeToggle className={styles.iconLink} />
              <Link href={ROUTES.notifications} className={styles.iconLink}>
                <BsBellFill size={20} />
              </Link>
              <Link
                href={ROUTES.messages(currentUser.username)}
                className={styles.iconLink}
              >
                <BiSolidMessage size={20} />
              </Link>
              <Link
                href={ROUTES.profile(currentUser.username)}
                className={styles.iconLink}
              >
                <IoHomeSharp size={20} />
              </Link>
            </nav>
          </>
        )}
      </div>
    </header>
  );
};
