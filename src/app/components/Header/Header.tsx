"use client";

import styles from "./Header.module.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Logo } from "../../uikit/brand/Logo/Logo";
import { Link } from "../../uikit/navigation/Link/Link";
import { Button } from "../../uikit/form/Button/Button";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";
import { ROUTES } from "@/routes/routes";
import { FaPowerOff } from "react-icons/fa";
import api from "@/config/axios";
import socket from "@/services/socket";
import { SearchBar } from "../../uikit/navigation/SearchBar/SearchBar";
import { ThemeToggle } from "@/app/uikit/brand/ThemeToggle/ThemeToggle";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { LocaleSwitcher } from "@/app/uikit/brand/LocaleSwitcher/LocaleSwitcher";
import { useSearch } from "@/app/hooks/shared/useSearch";
import { HeaderSkeleton } from "./HeaderSkeleton";
import { UserSearchDropdown } from "@/app/uikit/navigation/UserSearchDropdown/UserSearchDropdown";
import { NotificationsDropdown } from "@/app/uikit/overlays/NotificationsDropdown/NotificationsDropdown";
import { AuthLoader } from "@/app/components/AuthLoader/AuthLoader";
import { BsHouseDoorFill } from "react-icons/bs";

export const Header = () => {
  const t = useTranslations();
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const { query, results, search, select } = useSearch();
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);

  const handleSignOut = async () => {
    setIsSignOutOpen(false);
    try {
      await api.post("/signout");
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
            <Link href={ROUTES.feed} className={styles.logo}>
              <Logo />
              <span className={styles.logoTitle}>Petspace</span>
            </Link>
          </div>
          {currentUser && (
            <div className={styles.search}>
              <SearchBar value={query} onChange={search} />
              <UserSearchDropdown results={results} onSelect={select} />
            </div>
          )}
          <nav className={styles.actions}>
            <LocaleSwitcher className={styles.icon} />
            <ThemeToggle className={styles.icon} />
            {currentUser && <NotificationsDropdown />}
            {currentUser && (
              <Link
                href={ROUTES.profile(currentUser.username)}
                className={styles.icon}
              >
                <BsHouseDoorFill size={20} />
              </Link>
            )}
            {currentUser && (
              <Button
                appearance="ghost"
                className={styles.icon}
                onClick={() => setIsSignOutOpen(true)}
              >
                <FaPowerOff size={20} />
              </Button>
            )}
          </nav>
        </div>

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
