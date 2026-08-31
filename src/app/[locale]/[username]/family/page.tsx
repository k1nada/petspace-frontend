import { Header } from "@/app/components/Header/Header";
import { FamilyLayout } from "@/app/features/family/FamilyLayout/FamilyLayout";
import { getUser } from "@/services/api/user";
import { getBreeds } from "@/services/api/breeds";
import { getFamilyMembers } from "@/services/api/family";
import { notFound } from "next/navigation";

interface FamilyPageProps {
  params: Promise<{ username: string }>;
}

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
