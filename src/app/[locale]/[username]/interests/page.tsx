import { Header } from "@/app/components/Header/Header";
import { getUser } from "@/app/api/user";
import { ProfileInterestsLayout } from "@/app/features/profile/info/ProfileInterestsLayout/ProfileInterestsLayout";

interface ProfileInterestsPageProps {
  params: Promise<{ username: string }>;
}

const ProfileInterestsPage = async ({ params }: ProfileInterestsPageProps) => {
  const awaitedParams = await params;
  const userData = await getUser(awaitedParams.username);

  return (
    <>
      <Header/>
      <main>
        <ProfileInterestsLayout user={userData} />
      </main>
    </>
  );
};

export default ProfileInterestsPage;
