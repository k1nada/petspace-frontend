import { getUser } from "@/app/api/user";
import { Header } from "@/app/components/Header/Header";
import { MessagesLayout } from "@/app/features/messages/MessagesLayout/MessagesLayout";

interface Props {
  params: Promise<{ username: string }>;
}

const MessagesPage = async ({ params }: Props) => {
  const awaitedParams = await params;
  const userData = await getUser(awaitedParams.username);

  return (
    <>
      <Header/>
      <main>
        <MessagesLayout/>
      </main>
    </>
  );
};

export default MessagesPage;