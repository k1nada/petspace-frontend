import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/app/components/Header/Header";
import { ProfileEditorLayout } from "@/app/features/profile/info/ProfileEditorLayout/ProfileEditorLayout";
import { getUser } from "@/services/api/user";

interface EditPageProps {
  params: Promise<{ locale: string; username: string }>;
}

export const generateMetadata = async ({
  params,
}: EditPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("metadata.edit.title"),
    description: t("metadata.edit.description"),
  };
};

const EditPage = async ({ params }: EditPageProps) => {
  const awaitedParams = await params;
  const userData = await getUser(awaitedParams.username);

  return (
    <>
      <Header />
      <main>
        <ProfileEditorLayout user={userData} />
      </main>
    </>
  );
};

export default EditPage;
