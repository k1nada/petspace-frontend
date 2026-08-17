"use client";

import { useTranslations } from "next-intl";
import { BiSolidMessage } from "react-icons/bi";
import { FaPaw, FaBone, FaDog, FaTree } from "react-icons/fa";
import { FaCamera } from "react-icons/fa6";
import styles from "./Sidebar.module.scss";
import { ROUTES } from "@/routes/routes";
import { NavLink } from "@/app/uikit/navigation/NavLink/NavLink";
import { Tip } from "@/app/uikit/feedback/Tip/Tip";
import { useUserStore } from "@/app/hooks/useUserStore";
import { SidebarSkeleton } from "./SidebarSkeleton";
import { AuthLoader } from "@/app/components/AuthLoader/AuthLoader";

export const Sidebar = () => {
  const t = useTranslations();
  const currentUser = useUserStore((state) => state.currentUser);
  const requestCount = useUserStore((state) => state.requestCount);
  const tips = t.raw("dailyTip.tips") as string[];
  const tip = tips[new Date().getDay()];

  return (
    <AuthLoader fallback={<SidebarSkeleton />}>
      {currentUser && (
        <nav className={styles.container}>
          <div className={styles.list}>
            <NavLink href={ROUTES.profile(currentUser.username)}>
              <FaDog size={20} />
              {t("sidebar.profile")}
            </NavLink>
            <NavLink href={ROUTES.feed}>
              <FaBone size={20} />
              {t("sidebar.feed")}
            </NavLink>
            <NavLink href={ROUTES.messages(currentUser.username)}>
              <BiSolidMessage size={20} />
              {t("sidebar.messages")}
            </NavLink>
            <NavLink
              href={ROUTES.friends(currentUser.username)}
              count={requestCount}
            >
              <FaPaw size={20} />
              {t("sidebar.friends")}
            </NavLink>
            <NavLink href={ROUTES.photos(currentUser.username)}>
              <FaCamera size={20} />
              {t("sidebar.photos")}
            </NavLink>
            <NavLink href={ROUTES.familyTree(currentUser.username)}>
              <FaTree size={20} />
              {t("sidebar.familyTree")}
            </NavLink>
          </div>
          <Tip title={t("dailyTip.title")} text={tip} appearance="secondary" />
        </nav>
      )}
    </AuthLoader>
  );
};
