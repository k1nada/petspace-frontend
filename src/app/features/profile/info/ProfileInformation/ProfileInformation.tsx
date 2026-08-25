"use client";

import styles from "./ProfileInformation.module.scss";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/routes/routes";
import { NavLink } from "@/app/uikit/navigation/NavLink/NavLink";

interface ProfileInformationProps {
  username: string;
}

const ProfileInformation = ({ username }: ProfileInformationProps) => {
  const t = useTranslations();

  return (
    <nav className={styles.container}>
      <NavLink href={ROUTES.editProfile(username)}>
        {t("common.profile")}
      </NavLink>
      <NavLink href={ROUTES.editInterests(username)}>
        {t("profileInformation.interests")}
      </NavLink>
    </nav>
  );
};

export default ProfileInformation;
