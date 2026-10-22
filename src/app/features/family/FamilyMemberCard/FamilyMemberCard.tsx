"use client";

import styles from "./FamilyMemberCard.module.scss";
import { useState } from "react";
import { toast } from "react-toastify";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { Dropdown } from "@/app/uikit/overlays/Dropdown/Dropdown";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";
import { FaPaw } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/routes/routes";
import { FamilyMember } from "@/types";

interface FamilyMemberCardProps {
  member: FamilyMember;
  isOwner: boolean;
  onRemove: () => Promise<void>;
}

export const FamilyMemberCard = ({
  member,
  isOwner,
  onRemove,
}: FamilyMemberCardProps) => {
  const t = useTranslations();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const openConfirm = () => setIsConfirmOpen(true);
  const closeConfirm = () => setIsConfirmOpen(false);

  const handleRemove = async () => {
    try {
      await onRemove();
      closeConfirm();
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
      onClick: openConfirm,
      icon: <FaPaw size={16} />,
    },
  ];

  const content = (
    <>
      <div className={styles.avatar}>
        <Avatar src={member.avatar} size={56} />
      </div>
      <div className={styles.info}>
        <span className={styles.name}>{member.name}</span>
        {member.breed && <span className={styles.breed}>{member.breed}</span>}
      </div>
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
        title={t("familyTree.modalTitle")}
        description={t("familyTree.modalDescription", { name: member.name })}
        onConfirm={handleRemove}
        onClose={closeConfirm}
      />
    </li>
  );
};
