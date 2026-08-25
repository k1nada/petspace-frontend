import { getUser } from "@/app/api/user";
import { Header } from "@/app/components/Header/Header";
import { MessagesLayout } from "@/app/features/messages/MessagesLayout/MessagesLayout";
import { ChatContact } from "@/types";

interface MessagesPageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ user?: string }>;
}

const MessagesPage = async ({ params, searchParams }: MessagesPageProps) => {
  const { username } = await params;
  const { user: targetUsername } = await searchParams;

  const [userData, targetUser] = await Promise.all([
    getUser(username),
    targetUsername ? getUser(targetUsername) : Promise.resolve(null),
  ]);

  const initialSelectedChat: ChatContact | undefined = targetUser
    ? {
        id: targetUser.id,
        username: targetUser.username,
        name: targetUser.name,
        avatar: targetUser.avatar,
        isOnline: targetUser.isOnline,
      }
    : undefined;

  return (
    <>
      <Header />
      <main>
        <MessagesLayout
          user={userData}
          initialSelectedChat={initialSelectedChat}
        />
      </main>
    </>
  );
};

export default MessagesPage;
