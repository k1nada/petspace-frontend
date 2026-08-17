"use client";

import styles from "./FamilyLayout.module.scss";
import { useTranslations } from "next-intl";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { Tip } from "@/app/uikit/feedback/Tip/Tip";
import { FamilyMember, User } from "@/types";
import { Family } from "../Family/Family";

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
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <Family user={user} breeds={breeds} familyMembers={familyMembers} />
      </div>
      <div className={styles.rightColumn}>
        <Tip
          title={t("familyTip.title")}
          text={t("familyTip.text")}
          appearance="secondary"
        />
      </div>
    </div>
  );
};
