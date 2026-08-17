import { getFollowers, getFollowing } from "@/app/api/follows";
import { getFriends } from "@/app/api/friends";
import { getUser } from "@/app/api/user";
import { Header } from "@/app/components/Header/Header";
import { FriendsLayout } from "@/app/features/friends/FriendsLayout/FriendsLayout";
import { withMinDelay } from "@/utils/withMinDelay";

interface FriendsPageProps {
  params: Promise<{ username: string }>;
}

const FriendsPage = async ({ params }: FriendsPageProps) => {
  const { username } = await params;

  const [userData, friends, followers, following] = await withMinDelay(
    Promise.all([
      getUser(username),
      getFriends(username),
      getFollowers(username),
      getFollowing(username),
    ]),
  );

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
