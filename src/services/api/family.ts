import { unstable_cache } from "next/cache";
import api from "@/config/axios";
import { FamilyMember, FamilyRelation, NewFamilyMember } from "@/types";

export const getFamilyMembers = unstable_cache(
  async (username: string): Promise<FamilyMember[]> => {
    const { data } = await api.get<FamilyMember[]>(`/family/${username}`);
    return data;
  },
  ["get-family-members"],
  { revalidate: 30 },
);

export const addFamilyMember = async (
  relation: FamilyRelation,
  member: NewFamilyMember,
): Promise<FamilyMember> => {
  const { data } = await api.post<FamilyMember>("/family", {
    relation,
    ...member,
  });
  return data;
};

export const deleteFamilyMember = async (id: string): Promise<void> => {
  await api.delete(`/family/${id}`);
};
