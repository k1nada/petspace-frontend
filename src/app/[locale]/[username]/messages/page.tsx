import { getFriends } from "@/app/api/friends";
import { getUser } from "@/app/api/user";
import { Header } from "@/app/components/Header/Header";
import { MessagesLayout } from "@/app/features/messages/MessagesLayout/MessagesLayout";

interface MessagesPageProps {
  params: Promise<{ username: string }>;
}

const MessagesPage = async ({ params }: MessagesPageProps) => {
  const { username } = await params;

  const [userData, friends] = await Promise.all([
    getUser(username),
    getFriends(username),
  ]);

  return (
    <>
      <Header />
      <main>
        <MessagesLayout user={userData} friends={friends} />
      </main>
    </>
  );
};

export default MessagesPage;
