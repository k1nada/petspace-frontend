import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getUser } from "@/services/api/user";
import { Header } from "@/app/components/Header/Header";
import { PhotoGalleryLayout } from "@/app/features/photos/PhotoGalleryLayout/PhotoGalleryLayout";
import { notFound } from "next/navigation";

interface PhotosPageProps {
  params: Promise<{ locale: string; username: string }>;
}

export const generateMetadata = async ({
  params,
}: PhotosPageProps): Promise<Metadata> => {
  const { locale, username } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("metadata.photos.title", { username }),
    description: t("metadata.photos.description", { username }),
  };
};

const PhotosPage = async ({ params }: PhotosPageProps) => {
  const awaitedParams = await params;
  const userData = await getUser(awaitedParams.username);

  if (!userData) notFound();

  return (
    <>
      <Header />
      <main>
        <PhotoGalleryLayout
          name={userData.name}
          photos={userData.photos ?? []}
          avatar={userData.avatar}
          username={userData.username}
        />
      </main>
    </>
  );
};

export default PhotosPage;
