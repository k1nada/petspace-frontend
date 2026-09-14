"use client";

import { ROUTES } from "@/routes/routes";
import styles from "./ProfilePhotos.module.scss";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { useTranslations } from "next-intl";
import { getPhotoUrl } from "@/utils/photo";
import { deletePhoto as deletePhotoApi } from "@/services/api/upload";
import { revalidateUser } from "@/services/actions/revalidateUser";
import { usePhotoNavigation } from "@/app/hooks/photos/usePhotoNavigation";
import { usePhotoLikeSync } from "@/app/hooks/photos/usePhotoLikeSync";
import { usePhotoLikeRefresh } from "@/app/hooks/photos/usePhotoLikeRefresh";
import { PhotoModal } from "@/app/features/photos/PhotoModal/PhotoModal";
import { Photo } from "@/types";
import { ProfilePhotosSkeleton } from "./ProfilePhotosSkeleton";
import { AuthLoader } from "@/app/components/AuthLoader/AuthLoader";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";

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
  const newestFirstPhotos = [...localPhotos].reverse();
  const { selectedIndex, setSelectedIndex, handlePrev, handleNext } =
    usePhotoNavigation(newestFirstPhotos);

  const touchedPhotoIds = useRef<Set<string>>(new Set());
  usePhotoLikeRefresh(username, setLocalPhotos, touchedPhotoIds);
  const handleLikeChange = usePhotoLikeSync(setLocalPhotos, touchedPhotoIds);

  const handleDeletePhoto = async () => {
    const selectedPhoto =
      selectedIndex !== null ? newestFirstPhotos[selectedIndex] : null;
    if (!selectedPhoto) return;
    try {
      await deletePhotoApi(selectedPhoto.id);
      setSelectedIndex(null);
      await revalidateUser();
      window.location.reload();
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  return (
    <AuthLoader fallback={<ProfilePhotosSkeleton />}>
      <section className={styles.container}>
        <Link href={ROUTES.photos(username)} className={styles.titleLink}>
          <h3 className={styles.title}>{t("common.photos")}</h3>
          <span className={styles.count}>{localPhotos.length}</span>
        </Link>
        {localPhotos.length === 0 ? (
          <div className={styles.empty}>{t("common.noPhotosYet")}</div>
        ) : (
          <ul className={styles.gallery}>
            {newestFirstPhotos
              .slice(0, MAX_VISIBLE_PHOTOS)
              .map((photo, index) => (
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
          photo={
            selectedIndex !== null ? newestFirstPhotos[selectedIndex] : null
          }
          author={{ avatar, name, username }}
          navigation={{
            currentIndex: selectedIndex ?? 0,
            photosCount: newestFirstPhotos.length,
            onPrev: handlePrev,
            onNext: handleNext,
          }}
          isOwner={isOwner}
          onDelete={handleDeletePhoto}
          onClose={() => setSelectedIndex(null)}
          onLikeChange={handleLikeChange}
          enableRepost={!isOwner}
        />
      </section>
    </AuthLoader>
  );
};
