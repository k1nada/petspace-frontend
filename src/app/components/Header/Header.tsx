"use client";

import styles from "./Header.module.scss";
import { Logo } from "../../uikit/brand/Logo/Logo";
import { Link } from "../../uikit/navigation/Link/Link";
import { ROUTES } from "@/routes/routes";
import { IoHomeSharp } from "react-icons/io5";
import { BsBellFill } from "react-icons/bs";
import { BiSolidMessage } from "react-icons/bi";
import { SearchBar } from "../../uikit/navigation/SearchBar/SearchBar";
import { ThemeToggle } from "@/app/uikit/brand/ThemeToggle/ThemeToggle";
import { useUserStore } from "@/app/hooks/useUserStore";
import { LocaleSwitcher } from "@/app/uikit/brand/LocaleSwitcher/LocaleSwitcher";
import { useSearch } from "@/app/hooks/useSearch";
import { HeaderSkeleton } from "./HeaderSkeleton";
import { UserSearchDropdown } from "@/app/uikit/navigation/UserSearchDropdown/UserSearchDropdown";

export const Header = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const { results, search, select } = useSearch();
  const isLoading = useUserStore((state) => state.isLoading);

  if (isLoading) return <HeaderSkeleton />;

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
            <div className={styles.search}>
              <SearchBar onChange={search} />
              <UserSearchDropdown results={results} onSelect={select} />
            </div>
            <nav className={styles.actions}>
              <LocaleSwitcher className={styles.icon} />
              <ThemeToggle className={styles.icon} />
              <Link href={ROUTES.notifications} className={styles.icon}>
                <BsBellFill size={20} />
              </Link>
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
  );
};
