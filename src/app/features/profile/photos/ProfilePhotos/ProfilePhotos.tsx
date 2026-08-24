import { ROUTES } from "@/routes/routes";
import styles from "./ProfilePhotos.module.scss";
import Image from "next/image";
import { useState } from "react";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { useTranslations } from "next-intl";
import { getPhotoUrl } from "@/utils/photo";
import { usePhotoNavigation } from "@/app/hooks/usePhotoNavigation";
import { usePhotoLikeSync } from "@/app/hooks/usePhotoLikeSync";
import { usePhotoLikeRefresh } from "@/app/hooks/usePhotoLikeRefresh";
import { PhotoModal } from "@/app/features/photos/PhotoModal/PhotoModal";
import { Photo } from "@/types";
import { ProfilePhotosSkeleton } from "./ProfilePhotosSkeleton";
import { AuthLoader } from "@/app/components/AuthLoader/AuthLoader";
import { useAuthStore } from "@/app/hooks/useAuthStore";

interface ProfilePhotosProps {
  photos: Photo[];
  username: string;
  avatar?: string;
  name: string;
}

const MAX_VISIBLE_PHOTOS = 6;

export const ProfilePhotos = ({
  photos,
  username,
  avatar,
  name,
}: ProfilePhotosProps) => {
  const t = useTranslations();
  const currentUser = useAuthStore((state) => state.currentUser);
  const isOwner = currentUser?.username === username;
  const [localPhotos, setLocalPhotos] = useState<Photo[]>(photos);
  const { selectedIndex, setSelectedIndex, handlePrev, handleNext } =
    usePhotoNavigation(localPhotos);

  const handleLikeChange = usePhotoLikeSync(setLocalPhotos);
  usePhotoLikeRefresh(username, setLocalPhotos);

  return (
    <AuthLoader fallback={<ProfilePhotosSkeleton />}>
      <section className={styles.container}>
        <Link href={ROUTES.photos(username)} className={styles.titleLink}>
          <h3 className={styles.title}>{t("profilePhotos.title")}</h3>
          <span className={styles.count}>{localPhotos.length}</span>
        </Link>
        {localPhotos.length === 0 ? (
          <div className={styles.empty}>{t("profilePhotos.empty")}</div>
        ) : (
          <ul className={styles.gallery}>
            {localPhotos.slice(0, MAX_VISIBLE_PHOTOS).map((photo, index) => (
              <li key={photo.publicId} className={styles.photo}>
                <Image
                  onClick={() => setSelectedIndex(index)}
                  src={getPhotoUrl(photo)}
                  alt={t("postCreator.photo")}
                  fill
                />
              </li>
            ))}
          </ul>
        )}

        <PhotoModal
          photo={selectedIndex !== null ? localPhotos[selectedIndex] : null}
          avatar={avatar}
          name={name}
          currentIndex={selectedIndex ?? 0}
          photosCount={localPhotos.length}
          isOwner={isOwner}
          onClose={() => setSelectedIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          onLikeChange={handleLikeChange}
        />
      </section>
    </AuthLoader>
  );
};
