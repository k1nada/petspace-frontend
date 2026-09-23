"use client";

import styles from "./Header.module.scss";
import cn from "classnames";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Logo } from "../../uikit/brand/Logo/Logo";
import { Link } from "../../uikit/navigation/Link/Link";
import { Button } from "../../uikit/form/Button/Button";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";
import { ROUTES } from "@/routes/routes";
import { FaPowerOff, FaGlobe, FaMoon, FaSearch } from "react-icons/fa";
import { FaSun } from "react-icons/fa6";
import { signOut } from "@/services/api/auth";
import socket from "@/services/socket";
import { SearchBar } from "../../uikit/navigation/SearchBar/SearchBar";
import { MenuToggle } from "../../uikit/navigation/MenuToggle/MenuToggle";
import { ThemeToggle } from "@/app/uikit/brand/ThemeToggle/ThemeToggle";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { useThemeStore } from "@/app/hooks/shared/useThemeStore";
import { useToggleLocale } from "@/app/hooks/shared/useToggleLocale";
import { LocaleSwitcher } from "@/app/uikit/brand/LocaleSwitcher/LocaleSwitcher";
import { useSearch } from "@/app/hooks/shared/useSearch";
import { HeaderSkeleton } from "./HeaderSkeleton";
import { HeaderMobileSearch } from "./HeaderMobileSearch";
import { UserSearchDropdown } from "@/app/uikit/navigation/UserSearchDropdown/UserSearchDropdown";
import { NotificationsDropdown } from "@/app/uikit/overlays/NotificationsDropdown/NotificationsDropdown";
import { DropdownMenu } from "@/app/uikit/overlays/DropdownMenu/DropdownMenu";
import { AuthLoader } from "@/app/components/AuthLoader/AuthLoader";
import { BsHouseDoorFill } from "react-icons/bs";

export const Header = () => {
  const t = useTranslations();
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const { query, results, search, select } = useSearch();
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggle);
  const toggleLocale = useToggleLocale();

  const moreMenuItems = [
    {
      label: t("header.language"),
      icon: <FaGlobe size={18} />,
      onClick: toggleLocale,
    },
    {
      label: t("header.theme"),
      icon: theme === "light" ? <FaMoon size={18} /> : <FaSun size={18} />,
      onClick: toggleTheme,
    },
  ];

  if (currentUser) {
    moreMenuItems.push({
      label: t("header.signOut"),
      icon: <FaPowerOff size={18} />,
      onClick: () => setIsSignOutOpen(true),
    });
  }

  const handleSignOut = async () => {
    setIsSignOutOpen(false);
    try {
      await signOut();
    } catch {}
    localStorage.removeItem("token");
    socket.disconnect();
    useAuthStore.getState().signOut();
    router.push(ROUTES.signin);
  };

  return (
    <AuthLoader fallback={<HeaderSkeleton />}>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            {currentUser && (
              <MenuToggle className={cn(styles.icon, styles.menuToggle)} />
            )}
            <Link href={ROUTES.feed} className={styles.logo}>
              <Logo />
              <span className={styles.logoTitle}>Petspace</span>
            </Link>
          </div>
          {currentUser && (
            <div className={cn(styles.search, styles.desktopSearch)}>
              <SearchBar value={query} onChange={search} />
              <UserSearchDropdown results={results} onSelect={select} />
            </div>
          )}
          <nav className={styles.actions}>
            <LocaleSwitcher className={cn(styles.icon, styles.desktopIcon)} />
            <ThemeToggle className={cn(styles.icon, styles.desktopIcon)} />
            {currentUser && (
              <Button
                appearance="ghost"
                className={cn(styles.icon, styles.mobileSearchToggle)}
                onClick={() => setIsSearchOpen(true)}
              >
                <FaSearch size={18} />
              </Button>
            )}
            {currentUser && <NotificationsDropdown />}
            <span className={styles.mobileMenu}>
              <DropdownMenu
                items={moreMenuItems}
                className={styles.moreMenuDropdown}
              />
            </span>
            {currentUser && (
              <Link
                href={ROUTES.profile(currentUser.username)}
                className={cn(styles.icon, styles.desktopIcon)}
              >
                <BsHouseDoorFill size={20} />
              </Link>
            )}
            {currentUser && (
              <Button
                appearance="ghost"
                className={cn(styles.icon, styles.desktopIcon)}
                onClick={() => setIsSignOutOpen(true)}
              >
                <FaPowerOff size={20} />
              </Button>
            )}
          </nav>
        </div>

        <HeaderMobileSearch
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          query={query}
          onSearch={search}
          results={results}
          onSelect={select}
        />

        <ConfirmModal
          isOpen={isSignOutOpen}
          title={t("signOut.modalTitle")}
          description={t("signOut.modalDescription", {
            name: currentUser?.name ?? "",
          })}
          confirmLabel={t("signOut.leave")}
          cancelLabel={t("signOut.stay")}
          onConfirm={handleSignOut}
          onClose={() => setIsSignOutOpen(false)}
        />
      </header>
    </AuthLoader>
  );
};
