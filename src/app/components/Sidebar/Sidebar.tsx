"use client";

import { useTranslations } from "next-intl";
import { BiSolidMessage } from "react-icons/bi";
import { FaMapMarkerAlt, FaPaw, FaBone, FaDog, FaTree } from "react-icons/fa";
import { FaCamera } from "react-icons/fa6";
import styles from "./Sidebar.module.scss";
import { ROUTES } from "@/routes/routes";
import { NavLink } from "@/app/uikit/navigation/NavLink/NavLink";
import { Tip } from "@/app/uikit/feedback/Tip/Tip";
import { useUserStore } from "@/app/hooks/useUserStore";

export const Sidebar = () => {
  const t = useTranslations();
  const currentUser = useUserStore((state) => state.currentUser);
  const tips = t.raw("dailyTip.tips") as string[];
  const tip = tips[new Date().getDay()];

  if (!currentUser) return null;

  const username = currentUser.username;

  return (
    <nav className={styles.container}>
      <div className={styles.list}>
        <NavLink href={ROUTES.profile(username)}>
          <FaDog size={20} />
          {t("sidebar.profile")}
        </NavLink>
        <NavLink href={ROUTES.feed}>
          <FaBone size={20} />
          {t("sidebar.feed")}
        </NavLink>
        <NavLink href={ROUTES.messages(username)}>
          <BiSolidMessage size={20} />
          {t("sidebar.messages")}
        </NavLink>
        <NavLink href={ROUTES.friends(username)}>
          <FaPaw size={20} />
          {t("sidebar.friends")}
        </NavLink>
        <NavLink href={ROUTES.photos(username)}>
          <FaCamera size={20} />
          {t("sidebar.photos")}
        </NavLink>
        <NavLink href={ROUTES.familyTree(username)}>
          <FaTree size={20} />
          {t("sidebar.familyTree")}
        </NavLink>
        <NavLink href={ROUTES.places}>
          <FaMapMarkerAlt size={20} />
          {t("sidebar.places")}
        </NavLink>
      </div>
      <Tip title={t("dailyTip.title")} text={tip} appearance="primary" />
    </nav>
  );
};
