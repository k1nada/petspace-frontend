"use client";

import { useTranslations } from "next-intl";
import { Link } from "../../uikit/navigation/Link/Link";
import styles from "./Footer.module.scss";

const PRIVACY_POLICY_URL =
  "https://www.privacypolicies.com/live/370ce48b-ec13-4459-a05f-b5d112571ee6";

export const Footer = () => {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <span className={styles.copyright}>
        {t("footer.copyright", { year })}
      </span>
      <Link
        href={PRIVACY_POLICY_URL}
        target="_blank"
        appearance="secondary"
        className={styles.link}
      >
        {t("footer.privacyPolicy")}
      </Link>
    </footer>
  );
};
