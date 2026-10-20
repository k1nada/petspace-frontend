"use client";

import { ROUTES } from "@/routes/routes";
import { Card } from "@/app/uikit/layout/Card/Card";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
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
import { usePhotoLikeRefresh } from "@/app/hooks/photos/usePhotoLikeRefresh";
import { PhotoModal } from "@/app/features/photos/PhotoModal/PhotoModal";
import { Photo } from "@/types";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { useRouter } from "@/i18n/navigation";

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
  const router = useRouter();
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const [localPhotos, setLocalPhotos] = useState<Photo[]>(photos);
  const [prevPhotos, setPrevPhotos] = useState(photos);

  if (photos !== prevPhotos) {
    setPrevPhotos(photos);
    setLocalPhotos(photos);
  }
  const newestFirstPhotos = [...localPhotos].reverse();
  const {
    selectedIndex,
    setSelectedIndex,
    handlePrev,
    handleNext,
    prevPhoto,
    nextPhoto,
  } = usePhotoNavigation(newestFirstPhotos);

  const hasLiked = useRef(false);
  usePhotoLikeRefresh(username, setLocalPhotos, hasLiked);
  const handleLikeChange = (
    photoId: string,
    liked: boolean,
    likesCount: number,
  ) => {
    hasLiked.current = true;
    setLocalPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, liked, likesCount } : p)),
    );
  };

  const handleDeletePhoto = async () => {
    const selectedPhoto =
      selectedIndex !== null ? newestFirstPhotos[selectedIndex] : null;
    if (!selectedPhoto) return;
    try {
      const { avatarChanged } = await deletePhotoApi(selectedPhoto.id);
      setLocalPhotos((prev) => prev.filter((p) => p.id !== selectedPhoto.id));
      setSelectedIndex(null);
      await revalidateUser();
      if (avatarChanged) await fetchCurrentUser();
      router.refresh();
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  return (
    <Card as="section">
      <Link href={ROUTES.photos(username)} className={styles.titleLink}>
        <CardTitle>{t("common.photos")}</CardTitle>
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
                  sizes="120px"
                />
              </li>
            ))}
        </ul>
      )}

      <PhotoModal
        photo={selectedIndex !== null ? newestFirstPhotos[selectedIndex] : null}
        author={{ avatar, name, username }}
        navigation={{
          currentIndex: selectedIndex ?? 0,
          photosCount: newestFirstPhotos.length,
          onPrev: handlePrev,
          onNext: handleNext,
          prevPhoto,
          nextPhoto,
        }}
        isOwner={isOwner}
        onDelete={handleDeletePhoto}
        onClose={() => setSelectedIndex(null)}
        onLikeChange={handleLikeChange}
        enableRepost
      />
    </Card>
  );
};
