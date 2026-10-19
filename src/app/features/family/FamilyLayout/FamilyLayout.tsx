"use client";

import styles from "./FamilyLayout.module.scss";
import { useTranslations } from "next-intl";
import { Tip } from "@/app/uikit/feedback/Tip/Tip";
import { FamilyMember, User } from "@/types";
import { Family } from "../Family/Family";
import { AuthLoader } from "@/app/components/AuthLoader/AuthLoader";
import { FamilyLayoutSkeleton } from "./FamilyLayoutSkeleton";

interface FamilyLayoutProps {
  user: User;
  breeds: string[];
  familyMembers: FamilyMember[];
}

export const FamilyLayout = ({
  user,
  breeds,
  familyMembers,
}: FamilyLayoutProps) => {
  const t = useTranslations();

  return (
    <AuthLoader fallback={<FamilyLayoutSkeleton />}>
      <div className={styles.layout}>
        <div className={styles.content}>
          <Family user={user} breeds={breeds} familyMembers={familyMembers} />
        </div>
        <div className={styles.rightColumn}>
          <Tip title={t("common.didYouKnow")} text={t("familyTip.text")} />
        </div>
      </div>
    </AuthLoader>
  );
};
