import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/app/components/Header/Header";
import { ProfileLayout } from "@/app/features/profile/ProfileLayout/ProfileLayout";
import { getUser } from "@/services/api/user";
import { notFound } from "next/navigation";
import { getPostwall } from "@/services/api/postwall";

interface ProfilePageProps {
  params: Promise<{ locale: string; username: string }>;
}

export const generateMetadata = async ({
  params,
}: ProfilePageProps): Promise<Metadata> => {
  const { locale, username } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("metadata.profile.title", { username }),
    description: t("metadata.profile.description", { username }),
  };
};

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const awaitedParams = await params;

  const userData = await getUser(awaitedParams.username);

  if (!userData) notFound();

  let postwallData = null;
  try {
    postwallData = await getPostwall(awaitedParams.username);
  } catch (error) {
    postwallData = null;
  }

  return (
    <>
      <Header />
      <main>
        <ProfileLayout
          bannerInfo={{
            id: userData.id,
            name: userData.name,
            username: userData.username,
            avatar: userData.avatar,
            avatarPhotos: userData.avatarPhotos,
            sex: userData.sex,
            breed: userData.breed,
            birthDate: userData.birthDate,
            city: userData.city,
            bio: userData.bio,
            interests: userData.interests,
            photos: userData.photos,
            friends: userData.friends,
            followers: userData.followers,
            postwallId: postwallData?._id,
            achievements: userData.achievements,
          }}
        />
      </main>
    </>
  );
};

export default ProfilePage;
