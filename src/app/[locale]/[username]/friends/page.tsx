import { getFriends } from "@/app/api/friends";
import { getUser } from "@/app/api/user";
import { Header } from "@/app/components/Header/Header";
import { FriendsLayout } from "@/app/features/friends/FriendsLayout/FriendsLayout";

interface FriendsPageProps {
  params: Promise<{ username: string }>;
}

const FriendsPage = async ({ params }: FriendsPageProps) => {
  const { username } = await params;

  const [userData, friends] = await Promise.all([
    getUser(username),
    getFriends(username),
  ]);

  return (
    <>
      <Header />
      <main>
        <FriendsLayout username={userData.username} friends={friends} />
      </main>
    </>
  );
};

export default FriendsPage;
