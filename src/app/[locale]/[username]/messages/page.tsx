import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getUser } from "@/services/api/user";
import { Header } from "@/app/components/Header/Header";
import { MessagesLayout } from "@/app/features/messages/MessagesLayout/MessagesLayout";
import { ChatContact } from "@/types";

interface MessagesPageProps {
  params: Promise<{ locale: string; username: string }>;
  searchParams: Promise<{ user?: string }>;
}

export const generateMetadata = async ({
  params,
}: MessagesPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("metadata.messages.title"),
    description: t("metadata.messages.description"),
  };
};

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
