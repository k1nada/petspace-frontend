import { useState } from "react";
import { addFamilyMember, deleteFamilyMember } from "@/services/api/family";
import { FamilyMember, FamilyRelation, NewFamilyMember } from "@/types";

export const useFamilyTree = (initialMembers: FamilyMember[]) => {
  const [members, setMembers] = useState<FamilyMember[]>(initialMembers);

  const addMember = async (
    relation: FamilyRelation,
    member: NewFamilyMember,
  ) => {
    const newMember = await addFamilyMember(relation, member);
    setMembers((prev) => [...prev, newMember]);
  };

  const removeMember = async (id: string) => {
    await deleteFamilyMember(id);
    setMembers((prev) => prev.filter((member) => member.id !== id));
  };

  return {
    parents: members.filter((member) => member.relation === "parent"),
    children: members.filter((member) => member.relation === "child"),
    addMember,
    removeMember,
  };
};
