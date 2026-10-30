"use client";

import styles from "./FamilyColumn.module.scss";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/app/uikit/form/Button/Button";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
import { FamilyMember, FamilyRelation, NewFamilyMember } from "@/types";
import { FamilyMemberCard } from "../FamilyMemberCard/FamilyMemberCard";
import { AddFamilyMemberModal } from "../AddFamilyMemberModal/AddFamilyMemberModal";

const VISIBLE_MEMBERS_COUNT = 6;

interface FamilyColumnProps {
  title: string;
  emptyText: string;
  addLabel: string;
  relation: FamilyRelation;
  members: FamilyMember[];
  maxMembers?: number;
  limitText?: string;
  isOwner: boolean;
  breeds: string[];
  onAdd: (member: NewFamilyMember) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

export const FamilyColumn = ({
  title,
  emptyText,
  addLabel,
  relation,
  members,
  maxMembers,
  limitText,
  isOwner,
  breeds,
  onAdd,
  onRemove,
}: FamilyColumnProps) => {
  const t = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const closeModal = () => setIsModalOpen(false);
  const canAdd =
    isOwner && (maxMembers === undefined || members.length < maxMembers);
  const visibleMembers = isExpanded
    ? members
    : members.slice(0, VISIBLE_MEMBERS_COUNT);
  const hasHiddenMembers = visibleMembers.length < members.length;

  const addMember = async (member: NewFamilyMember) => {
    await onAdd(member);
    closeModal();
  };

  return (
    <div className={styles.column}>
      <CardTitle className={styles.title} count={members.length}>
        {title}
      </CardTitle>

      {members.length > 0 ? (
        <ul className={styles.list}>
          {visibleMembers.map((member) => (
            <FamilyMemberCard
              key={member.id}
              member={member}
              isOwner={isOwner}
              onRemove={() => onRemove(member.id)}
            />
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>{emptyText}</p>
      )}

      {hasHiddenMembers && (
        <Button appearance="tertiary" onClick={() => setIsExpanded(true)}>
          {t("familyTree.showAll", { count: members.length })}
        </Button>
      )}

      {canAdd && (
        <Button appearance="secondary" onClick={() => setIsModalOpen(true)}>
          {addLabel}
        </Button>
      )}

      {isOwner && !canAdd && limitText && (
        <p className={styles.empty}>{limitText}</p>
      )}

      <AddFamilyMemberModal
        isOpen={isModalOpen}
        relation={relation}
        breeds={breeds}
        onClose={closeModal}
        onAdd={addMember}
      />
    </div>
  );
};
