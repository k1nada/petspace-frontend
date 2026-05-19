import { getFriends } from "@/app/api/friends";
import { getUser } from "@/app/api/user";
import { Header } from "@/app/components/Header/Header";
import { FriendsLayout } from "@/app/features/friends/FriendsLayout/FriendsLayout";

interface FriendsPageProps {
  params: Promise<{ username: string }>;
}

const FriendsPage = async ({ params }: FriendsPageProps) => {
  const awaitedParams = await params;
  const userData = await getUser(awaitedParams.username);
  const friends = await getFriends(awaitedParams.username);

  return (
    <>
      <Header/>
      <main>
        <FriendsLayout username={userData.username} friends={friends} />
      </main>
    </>
  );
};

export default FriendsPage;
