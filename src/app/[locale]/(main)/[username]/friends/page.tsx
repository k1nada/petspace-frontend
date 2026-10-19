import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getFollowers, getFollowing } from "@/services/api/follows";
import { getFriends } from "@/services/api/friends";
import { getUser } from "@/services/api/user";
import { FriendsLayout } from "@/app/features/friends/FriendsLayout/FriendsLayout";
import { notFound } from "next/navigation";

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

  const userData = await getUser(username);
  if (!userData) notFound();

  const [friends, followers, following] = await Promise.all([
    getFriends(username),
    getFollowers(username),
    getFollowing(username),
  ]);

  return (
    <FriendsLayout
      username={userData.username}
      name={userData.name}
      friends={friends}
      followers={followers}
      following={following}
    />
  );
};

export default FriendsPage;
