"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import cn from "classnames";
import { BiSolidMessage } from "react-icons/bi";
import { FaPaw, FaBone, FaDog, FaTree } from "react-icons/fa";
import { usePathname } from "@/i18n/navigation";
import { PhotoIcon } from "@/app/uikit/brand/PhotoIcon/PhotoIcon";
import { ROUTES } from "@/routes/routes";
import { NavLink } from "@/app/uikit/navigation/NavLink/NavLink";
import { Tip } from "@/app/uikit/feedback/Tip/Tip";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { useFriendRequestsStore } from "@/app/hooks/friends/useFriendRequestsStore";
import { useMessagesStore } from "@/app/hooks/messages/useMessagesStore";
import { useMobileMenuStore } from "@/app/hooks/shared/useMobileMenuStore";
import { AuthLoader } from "@/app/components/AuthLoader/AuthLoader";
import { SidebarSkeleton } from "./SidebarSkeleton";
import styles from "./Sidebar.module.scss";

export const Sidebar = () => {
  const t = useTranslations();
  const currentUser = useAuthStore((state) => state.currentUser);
  const requestCount = useFriendRequestsStore((state) => state.requestCount);
  const unreadMessagesCount = useMessagesStore(
    (state) => state.unreadMessagesCount,
  );
  const isMobileMenuOpen = useMobileMenuStore((state) => state.isOpen);
  const closeMobileMenu = useMobileMenuStore((state) => state.close);
  const pathname = usePathname();
  const tips = t.raw("dailyTip.tips") as string[];
  const tip = tips[new Date().getDay()];

  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  return (
    <AuthLoader fallback={<SidebarSkeleton />}>
      {currentUser && (
        <>
          {isMobileMenuOpen && (
            <div className={styles.overlay} onClick={closeMobileMenu} />
          )}
          <nav
            className={cn(styles.container, {
              [styles.containerOpen]: isMobileMenuOpen,
            })}
          >
            <div className={styles.list}>
              <NavLink
                href={ROUTES.profile(currentUser.username)}
                onClick={closeMobileMenu}
              >
                <FaDog size={20} />
                {t("common.profile")}
              </NavLink>
              <NavLink href={ROUTES.feed} onClick={closeMobileMenu}>
                <FaBone size={20} />
                {t("sidebar.feed")}
              </NavLink>
              <NavLink
                href={ROUTES.messages(currentUser.username)}
                count={unreadMessagesCount}
                onClick={closeMobileMenu}
              >
                <BiSolidMessage size={20} />
                {t("common.messages")}
              </NavLink>
              <NavLink
                href={ROUTES.friends(currentUser.username)}
                count={requestCount}
                onClick={closeMobileMenu}
              >
                <FaPaw size={20} />
                {t("common.friends")}
              </NavLink>
              <NavLink
                href={ROUTES.photos(currentUser.username)}
                onClick={closeMobileMenu}
              >
                <PhotoIcon size={20} />
                {t("common.photos")}
              </NavLink>
              <NavLink
                href={ROUTES.familyTree(currentUser.username)}
                onClick={closeMobileMenu}
              >
                <FaTree size={20} />
                {t("common.familyTree")}
              </NavLink>
            </div>
            <Tip title={t("dailyTip.title")} text={tip} />
          </nav>
        </>
      )}
    </AuthLoader>
  );
};
