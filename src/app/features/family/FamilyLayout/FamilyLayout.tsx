"use client";

import styles from "./FamilyLayout.module.scss";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
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
  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <Family user={user} breeds={breeds} familyMembers={familyMembers} />
      </div>
      <div className={styles.rightColumn} /* TODO add widgets */ />
    </div>
  );
};
