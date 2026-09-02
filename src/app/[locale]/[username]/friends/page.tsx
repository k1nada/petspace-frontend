import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getFollowers, getFollowing } from "@/services/api/follows";
import { getFriends } from "@/services/api/friends";
import { getUser } from "@/services/api/user";
import { Header } from "@/app/components/Header/Header";
import { FriendsLayout } from "@/app/features/friends/FriendsLayout/FriendsLayout";

interface FriendsPageProps {
  params: Promise<{ locale: string; username: string }>;
}

export const generateMetadata = async ({
  params,
}: FriendsPageProps): Promise<Metadata> => {
  const { locale, username } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("metadata.friends.title", { username }),
    description: t("metadata.friends.description", { username }),
  };
};

const FriendsPage = async ({ params }: FriendsPageProps) => {
  const { username } = await params;

  const [userData, friends, followers, following] = await Promise.all([
    getUser(username),
    getFriends(username),
    getFollowers(username),
    getFollowing(username),
  ]);

  return (
    <>
      <Header />
      <main>
        <FriendsLayout
          username={userData.username}
          friends={friends}
          followers={followers}
          following={following}
        />
      </main>
    </>
  );
};

export default FriendsPage;
