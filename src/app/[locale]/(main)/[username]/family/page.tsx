import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FamilyLayout } from "@/app/features/family/FamilyLayout/FamilyLayout";
import { getUser } from "@/services/api/user";
import { getBreeds } from "@/services/api/breeds";
import { getFamilyMembers } from "@/services/api/family";
import { notFound } from "next/navigation";

interface FamilyPageProps {
  params: Promise<{ locale: string; username: string }>;
}

export const generateMetadata = async ({
  params,
}: FamilyPageProps): Promise<Metadata> => {
  const { locale, username } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("metadata.family.title", { username }),
    description: t("metadata.family.description", { username }),
  };
};

const FamilyPage = async ({ params }: FamilyPageProps) => {
  const { username } = await params;
  const userData = await getUser(username);
  if (!userData) notFound();

  const [breeds, familyMembers] = await Promise.all([
    getBreeds(),
    getFamilyMembers(username),
  ]);

  return (
    <FamilyLayout
      user={userData}
      breeds={breeds}
      familyMembers={familyMembers}
    />
  );
};

export default FamilyPage;
