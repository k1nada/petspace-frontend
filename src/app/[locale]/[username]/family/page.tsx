import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/app/components/Header/Header";
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
  const [userData, breeds, familyMembers] = await Promise.all([
    getUser(username),
    getBreeds(),
    getFamilyMembers(username),
  ]);

  if (!userData) notFound();

  return (
    <>
      <Header />
      <main>
        <FamilyLayout
          user={userData}
          breeds={breeds}
          familyMembers={familyMembers}
        />
      </main>
    </>
  );
};

export default FamilyPage;
