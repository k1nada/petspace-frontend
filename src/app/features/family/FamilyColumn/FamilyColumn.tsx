"use client";

import styles from "./FamilyColumn.module.scss";
import { useState } from "react";
import { Button } from "@/app/uikit/form/Button/Button";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
import { FamilyMember, FamilyRelation, NewFamilyMember } from "@/types";
import { FamilyMemberCard } from "../FamilyMemberCard/FamilyMemberCard";
import { AddFamilyMemberModal } from "../AddFamilyMemberModal/AddFamilyMemberModal";

interface FamilyColumnProps {
  title: string;
  emptyText: string;
  addLabel: string;
  relation: FamilyRelation;
  members: FamilyMember[];
  isOwner: boolean;
  breeds: string[];
  avatar?: string;
  onAdd: (member: NewFamilyMember) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

export const FamilyColumn = ({
  title,
  emptyText,
  addLabel,
  relation,
  members,
  isOwner,
  breeds,
  avatar,
  onAdd,
  onRemove,
}: FamilyColumnProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);

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
          {members.map((member) => (
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

      {isOwner && (
        <Button appearance="secondary" onClick={() => setIsModalOpen(true)}>
          {addLabel}
        </Button>
      )}

      <AddFamilyMemberModal
        isOpen={isModalOpen}
        relation={relation}
        breeds={breeds}
        avatar={avatar}
        existingMemberAvatar={members[0]?.avatar}
        onClose={closeModal}
        onAdd={addMember}
      />
    </div>
  );
};
