"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FaPlus } from "react-icons/fa";
import { Button } from "@/app/uikit/form/Button/Button";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
import { FamilyMember, FamilyRelation, NewFamilyMember } from "@/types";
import { FamilyMiniCard } from "../FamilyMiniCard/FamilyMiniCard";
import { AddFamilyMemberModal } from "../AddFamilyMemberModal/AddFamilyMemberModal";
import styles from "./FamilyGrid.module.scss";

const VISIBLE_MEMBERS_COUNT = 6;

interface FamilyGridProps {
  title: string;
  emptyText: string;
  addLabel: string;
  relation: FamilyRelation;
  members: FamilyMember[];
  maxMembers: number;
  isOwner: boolean;
  breeds: string[];
  onAdd: (member: NewFamilyMember) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

export const FamilyGrid = ({
  title,
  emptyText,
  addLabel,
  relation,
  members,
  maxMembers,
  isOwner,
  breeds,
  onAdd,
  onRemove,
}: FamilyGridProps) => {
  const t = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const canAdd = isOwner && members.length < maxMembers;
  const visibleMembers = isExpanded
    ? members
    : members.slice(0, VISIBLE_MEMBERS_COUNT);
  const hasHiddenMembers = visibleMembers.length < members.length;
  const isEmpty = members.length === 0 && !canAdd;

  const addMember = async (member: NewFamilyMember) => {
    await onAdd(member);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.section}>
      <CardTitle count={members.length}>{title}</CardTitle>

      {isEmpty ? (
        <p className={styles.empty}>{emptyText}</p>
      ) : (
        <ul className={styles.grid}>
          {visibleMembers.map((member) => (
            <FamilyMiniCard
              key={member.id}
              member={member}
              isOwner={isOwner}
              onRemove={() => onRemove(member.id)}
            />
          ))}
          {canAdd && (
            <li>
              <button
                className={styles.addCard}
                onClick={() => setIsModalOpen(true)}
              >
                <FaPlus size={12} />
                {addLabel}
              </button>
            </li>
          )}
        </ul>
      )}

      {hasHiddenMembers && (
        <Button appearance="tertiary" onClick={() => setIsExpanded(true)}>
          {t("familyTree.showAll", { count: members.length })}
        </Button>
      )}

      <AddFamilyMemberModal
        isOpen={isModalOpen}
        relation={relation}
        breeds={breeds}
        onClose={() => setIsModalOpen(false)}
        onAdd={addMember}
      />
    </div>
  );
};
