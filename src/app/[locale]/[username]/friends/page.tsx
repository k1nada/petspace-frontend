import { getFollowers, getFollowing } from "@/services/api/follows";
import { getFriends } from "@/services/api/friends";
import { getUser } from "@/services/api/user";
import { Header } from "@/app/components/Header/Header";
import { FriendsLayout } from "@/app/features/friends/FriendsLayout/FriendsLayout";

interface FriendsPageProps {
  params: Promise<{ username: string }>;
}

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
