import { getPhotoComments } from "@/app/api/comment";
import { getUser } from "@/app/api/user";
import { Header } from "@/app/components/Header/Header";
import { PhotoGalleryLayout } from "@/app/features/photos/PhotoGalleryLayout/PhotoGalleryLayout";
import { Photo } from "@/types";

interface PhotosPageProps {
  params: Promise<{ username: string }>;
}

const PhotosPage = async ({ params }: PhotosPageProps) => {
  const awaitedParams = await params;
  const userData = await getUser(awaitedParams.username);

  const photosWithComments = await Promise.all(
    (userData.photos ?? []).map(async (photo: Photo) => ({
      ...photo,
      comments: await getPhotoComments(photo.id),
    })),
  );

  return (
    <>
      <Header/>
      <main>
        <PhotoGalleryLayout
          name={userData.name}
          photos={photosWithComments}
          avatar={userData.avatar}
        />
      </main>
    </>
  );
};

export default PhotosPage;
