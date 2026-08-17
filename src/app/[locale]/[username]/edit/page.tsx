import { Header } from "@/app/components/Header/Header";
import { ProfileEditorLayout } from "@/app/features/profile/info/ProfileEditorLayout/ProfileEditorLayout";
import { getUser } from "@/app/api/user";
import { withMinDelay } from "@/utils/withMinDelay";

interface EditPageProps {
  params: Promise<{ username: string }>;
}

const EditPage = async ({ params }: EditPageProps) => {
  const awaitedParams = await params;
  const userData = await withMinDelay(getUser(awaitedParams.username));

  return (
    <>
      <Header/>
      <main>
        <ProfileEditorLayout user={userData} />
      </main>
    </>
  );
};

export default EditPage;
