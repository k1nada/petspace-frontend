import { useTranslations } from "next-intl";
import { TipSkeleton } from "@/app/uikit/feedback/Tip/TipSkeleton";
import { FamilySkeleton } from "../Family/FamilySkeleton";
import styles from "./FamilyLayout.module.scss";

export const FamilyLayoutSkeleton = () => {
  const t = useTranslations();

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <FamilySkeleton />
      </div>
      <div className={styles.rightColumn}>
        <TipSkeleton
          title={t("common.didYouKnow")}
          text={t("familyTip.text")}
        />
      </div>
    </div>
  );
};
