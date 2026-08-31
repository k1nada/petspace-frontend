import { getPhotoComments } from "@/app/api/comment";
import { getUser } from "@/app/api/user";
import { Header } from "@/app/components/Header/Header";
import { PhotoGalleryLayout } from "@/app/features/photos/PhotoGalleryLayout/PhotoGalleryLayout";
import { Photo } from "@/types";

interface PhotosPageProps {
  params: Promise<{ username: string }>;
}

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
      <Header/>
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
