import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/app/components/Header/Header";
import { getUser } from "@/services/api/user";
import { ProfileInterestsLayout } from "@/app/features/profile/info/ProfileInterestsLayout/ProfileInterestsLayout";

interface ProfileInterestsPageProps {
  params: Promise<{ locale: string; username: string }>;
}

export const generateMetadata = async ({
  params,
}: ProfileInterestsPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("metadata.interests.title"),
    description: t("metadata.interests.description"),
  };
};

const ProfileInterestsPage = async ({ params }: ProfileInterestsPageProps) => {
  const { username } = await params;
  const userData = await getUser(username);

  return (
    <>
      <Header />
      <main>
        <ProfileInterestsLayout user={userData} />
      </main>
    </>
  );
};

export default ProfileInterestsPage;
