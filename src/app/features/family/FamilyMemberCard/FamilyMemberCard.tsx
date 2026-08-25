"use client";

import styles from "./FamilyMemberCard.module.scss";
import { useState } from "react";
import { toast } from "react-toastify";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { DropdownMenu } from "@/app/uikit/overlays/DropdownMenu/DropdownMenu";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";
import { MdDeleteSweep } from "react-icons/md";
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
      label: t("common.remove"),
      onClick: openConfirm,
      icon: <MdDeleteSweep size={20} />,
    },
  ];

  const content = (
    <>
      <Avatar src={member.avatar} size={60} />
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
          <DropdownMenu items={menuItems} />
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
