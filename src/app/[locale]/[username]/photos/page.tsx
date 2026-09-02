import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPhotoComments } from "@/services/api/comment";
import { getUser } from "@/services/api/user";
import { Header } from "@/app/components/Header/Header";
import { PhotoGalleryLayout } from "@/app/features/photos/PhotoGalleryLayout/PhotoGalleryLayout";
import { Photo } from "@/types";

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

const loadPageData = async (username: string) => {
  const userData = await getUser(username);

  const photosWithComments = await Promise.all(
    (userData.photos ?? []).map(async (photo: Photo) => ({
      ...photo,
      comments: (await getPhotoComments(photo.id)) ?? [],
    })),
  );

  return { userData, photosWithComments };
};

const PhotosPage = async ({ params }: PhotosPageProps) => {
  const awaitedParams = await params;
  const { userData, photosWithComments } = await loadPageData(
    awaitedParams.username,
  );

  return (
    <>
      <Header />
      <main>
        <PhotoGalleryLayout
          name={userData.name}
          photos={photosWithComments}
          avatar={userData.avatar}
          username={userData.username}
        />
      </main>
    </>
  );
};

export default PhotosPage;
