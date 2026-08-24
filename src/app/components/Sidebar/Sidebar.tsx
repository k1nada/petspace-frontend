"use client";

import { useTranslations } from "next-intl";
import { BiSolidMessage } from "react-icons/bi";
import { FaPaw, FaBone, FaDog, FaTree } from "react-icons/fa";
import { FaCamera } from "react-icons/fa6";
import styles from "./Sidebar.module.scss";
import { ROUTES } from "@/routes/routes";
import { NavLink } from "@/app/uikit/navigation/NavLink/NavLink";
import { Tip } from "@/app/uikit/feedback/Tip/Tip";
import { useAuthStore } from "@/app/hooks/useAuthStore";
import { useFriendRequestsStore } from "@/app/hooks/useFriendRequestsStore";
import { useMessagesStore } from "@/app/hooks/useMessagesStore";
import { SidebarSkeleton } from "./SidebarSkeleton";
import { AuthLoader } from "@/app/components/AuthLoader/AuthLoader";

export const Sidebar = () => {
  const t = useTranslations();
  const currentUser = useAuthStore((state) => state.currentUser);
  const requestCount = useFriendRequestsStore((state) => state.requestCount);
  const unreadMessagesCount = useMessagesStore(
    (state) => state.unreadMessagesCount,
  );
  const tips = t.raw("dailyTip.tips") as string[];
  const tip = tips[new Date().getDay()];

  return (
    <AuthLoader fallback={<SidebarSkeleton />}>
      {currentUser && (
        <nav className={styles.container}>
          <div className={styles.list}>
            <NavLink href={ROUTES.profile(currentUser.username)}>
              <FaDog size={20} />
              {t("common.profile")}
            </NavLink>
            <NavLink href={ROUTES.feed}>
              <FaBone size={20} />
              {t("sidebar.feed")}
            </NavLink>
            <NavLink
              href={ROUTES.messages(currentUser.username)}
              count={unreadMessagesCount}
            >
              <BiSolidMessage size={20} />
              {t("common.messages")}
            </NavLink>
            <NavLink
              href={ROUTES.friends(currentUser.username)}
              count={requestCount}
            >
              <FaPaw size={20} />
              {t("common.friends")}
            </NavLink>
            <NavLink href={ROUTES.photos(currentUser.username)}>
              <FaCamera size={20} />
              {t("common.photos")}
            </NavLink>
            <NavLink href={ROUTES.familyTree(currentUser.username)}>
              <FaTree size={20} />
              {t("common.familyTree")}
            </NavLink>
          </div>
          <Tip title={t("dailyTip.title")} text={tip} appearance="secondary" />
        </nav>
      )}
    </AuthLoader>
  );
};
