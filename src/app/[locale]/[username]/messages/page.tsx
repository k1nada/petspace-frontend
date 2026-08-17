import { getConversations } from "@/app/api/conversations";
import { getUser } from "@/app/api/user";
import { Header } from "@/app/components/Header/Header";
import { MessagesLayout } from "@/app/features/messages/MessagesLayout/MessagesLayout";
import { withMinDelay } from "@/utils/withMinDelay";

interface MessagesPageProps {
  params: Promise<{ username: string }>;
}

const MessagesPage = async ({ params }: MessagesPageProps) => {
  const { username } = await params;

  const [userData, conversations] = await withMinDelay(
    Promise.all([getUser(username), getConversations(username)]),
  );

  return (
    <>
      <Header />
      <main>
        <MessagesLayout user={userData} conversations={conversations} />
      </main>
    </>
  );
};

export default MessagesPage;
