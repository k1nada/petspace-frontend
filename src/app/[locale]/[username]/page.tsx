import { Header } from "@/app/components/Header/Header";
import { ProfileLayout } from "@/app/features/profile/ProfileLayout/ProfileLayout";
import { getUser } from "@/app/api/user";
import { notFound } from "next/navigation";
import { getPostwall } from "@/app/api/postwall";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const awaitedParams = await params;

  const [userData, postwallData] = await Promise.all([
    getUser(awaitedParams.username),
    getPostwall(awaitedParams.username),
  ]);

  if (!userData) notFound();

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
            postwallId: postwallData._id,
            achievements: userData.achievements,
          }}
        />
      </main>
    </>
  );
};

export default ProfilePage;
