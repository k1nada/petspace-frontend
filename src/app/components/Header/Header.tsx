"use client";

import styles from "./Header.module.scss";
import { Logo } from "../../uikit/brand/Logo/Logo";
import { Link } from "../../uikit/navigation/Link/Link";
import { ROUTES } from "@/routes/routes";
import { IoHomeSharp } from "react-icons/io5";
import { BiSolidMessage } from "react-icons/bi";
import { SearchBar } from "../../uikit/navigation/SearchBar/SearchBar";
import { ThemeToggle } from "@/app/uikit/brand/ThemeToggle/ThemeToggle";
import { useUserStore } from "@/app/hooks/useUserStore";
import { LocaleSwitcher } from "@/app/uikit/brand/LocaleSwitcher/LocaleSwitcher";
import { useSearch } from "@/app/hooks/useSearch";
import { HeaderSkeleton } from "./HeaderSkeleton";
import { UserSearchDropdown } from "@/app/uikit/navigation/UserSearchDropdown/UserSearchDropdown";
import { NotificationsDropdown } from "@/app/uikit/overlays/NotificationsDropdown/NotificationsDropdown";
import { AuthLoader } from "@/app/components/AuthLoader/AuthLoader";

export const Header = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const { query, results, search, select } = useSearch();

  return (
    <AuthLoader fallback={<HeaderSkeleton />}>
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
              <div className={styles.search}>
                <SearchBar value={query} onChange={search} />
                <UserSearchDropdown results={results} onSelect={select} />
              </div>
              <nav className={styles.actions}>
                <LocaleSwitcher className={styles.icon} />
                <ThemeToggle className={styles.icon} />
                <NotificationsDropdown />
                <Link
                  href={ROUTES.messages(currentUser.username)}
                  className={styles.icon}
                >
                  <BiSolidMessage size={20} />
                </Link>
                <Link
                  href={ROUTES.profile(currentUser.username)}
                  className={styles.icon}
                >
                  <IoHomeSharp size={20} />
                </Link>
              </nav>
            </>
          )}
        </div>
      </header>
    </AuthLoader>
  );
};
