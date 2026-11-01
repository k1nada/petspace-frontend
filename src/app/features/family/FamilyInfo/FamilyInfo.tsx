"use client";

import { useTranslations } from "next-intl";
import { MdInfoOutline } from "react-icons/md";
import { Dropdown } from "@/app/uikit/overlays/Dropdown/Dropdown";
import styles from "./FamilyInfo.module.scss";

export const FamilyInfo = () => {
  const t = useTranslations();

  return (
    <Dropdown
      align="center"
      label={t("familyTree.about")}
      trigger={<MdInfoOutline size={18} />}
      className={styles.info}
      content={
        <div className={styles.popover}>
          <p className={styles.title}>{t("common.didYouKnow")}</p>
          <p className={styles.text}>{t("familyTip.text")}</p>
        </div>
      }
    />
  );
};
