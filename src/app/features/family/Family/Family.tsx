"use client";

import styles from "./Family.module.scss";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { FamilyColumn } from "../FamilyColumn/FamilyColumn";
import { FamilyMember, User } from "@/types";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/app/hooks/useAuthStore";
import { useFamilyTree } from "@/app/hooks/useFamilyTree";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { ROUTES } from "@/routes/routes";

interface FamilyProps {
  user: User;
  breeds: string[];
  familyMembers: FamilyMember[];
}

export const Family = ({ user, breeds, familyMembers }: FamilyProps) => {
  const { username, name, breed, avatar } = user;
  const t = useTranslations();
  const currentUser = useAuthStore((state) => state.currentUser);
  const isOwner = currentUser?.username === username;
  const { parents, children, addMember, removeMember } =
    useFamilyTree(familyMembers);

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>{t("familyTree.title")}</h1>

      <div className={styles.content}>
        <div className={styles.parentsColumn}>
          <FamilyColumn
            title={t("familyTree.parents")}
            emptyText={t("familyTree.emptyParents")}
            addLabel={t("familyTree.addParent")}
            relation="parent"
            members={parents}
            isOwner={isOwner}
            breeds={breeds}
            onAdd={(member) => addMember("parent", member)}
            onRemove={removeMember}
          />
        </div>

        <div className={styles.divider} />

        <Link href={ROUTES.profile(username)} className={styles.user}>
          <Avatar src={avatar} size={96} />
          <span className={styles.name}>{name}</span>
          {breed && <span className={styles.breed}>{breed}</span>}
        </Link>

        <div className={styles.divider} />

        <div className={styles.childrenColumn}>
          <FamilyColumn
            title={t("familyTree.children")}
            emptyText={t("familyTree.emptyChildren")}
            addLabel={t("familyTree.addPuppy")}
            relation="child"
            members={children}
            isOwner={isOwner}
            breeds={breeds}
            onAdd={(member) => addMember("child", member)}
            onRemove={removeMember}
          />
        </div>
      </div>
    </section>
  );
};
