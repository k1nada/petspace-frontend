"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { FaPaw } from "react-icons/fa";
import { ROUTES } from "@/routes/routes";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { Dropdown } from "@/app/uikit/overlays/Dropdown/Dropdown";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";
import { FamilyMember } from "@/types";
import styles from "./FamilyMiniCard.module.scss";

const AVATAR_SIZE = 48;

interface FamilyMiniCardProps {
  member: FamilyMember;
  isOwner: boolean;
  onRemove: () => Promise<void>;
}

export const FamilyMiniCard = ({
  member,
  isOwner,
  onRemove,
}: FamilyMiniCardProps) => {
  const t = useTranslations();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const name = member.name || member.username || "";

  const handleRemove = async () => {
    try {
      await onRemove();
      setIsConfirmOpen(false);
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const menuItems = [
    {
      label:
        member.relation === "parent"
          ? t("familyTree.removeParent")
          : t("familyTree.removePuppy"),
      onClick: () => setIsConfirmOpen(true),
      icon: <FaPaw size={16} />,
    },
  ];

  const content = (
    <>
      <Avatar src={member.avatar} size={AVATAR_SIZE} />
      <span className={styles.name}>{name}</span>
      {member.breed && <span className={styles.breed}>{member.breed}</span>}
    </>
  );

  return (
    <li className={styles.card}>
      {member.username ? (
        <Link href={ROUTES.profile(member.username)} className={styles.link}>
          {content}
        </Link>
      ) : (
        <div className={styles.link}>{content}</div>
      )}

      {isOwner && (
        <div className={styles.menu}>
          <Dropdown items={menuItems} />
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title={t("familyTree.modalTitle", { name })}
        description={t("common.cannotUndo")}
        onConfirm={handleRemove}
        onClose={() => setIsConfirmOpen(false)}
      />
    </li>
  );
};
