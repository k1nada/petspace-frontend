"use client";

import { Button } from "@/app/uikit/form/Button/Button";
import styles from "./PhotoGallery.module.scss";
import { useTranslations } from "next-intl";
import { PhotoModal } from "../PhotoModal/PhotoModal";
import { PhotoUploadModal } from "../PhotoUploadModal/PhotoUploadModal";
import { usePhotoNavigation } from "@/app/hooks/photos/usePhotoNavigation";
import { usePhotoGallery } from "@/app/hooks/photos/usePhotoGallery";
import { Photo } from "@/types";
import { PhotoGallerySkeleton } from "./PhotoGallerySkeleton";
import { PhotoGrid } from "../PhotoGrid/PhotoGrid";
import { EmptyState } from "@/app/uikit/feedback/EmptyState/EmptyState";
import { AuthLoader } from "@/app/components/AuthLoader/AuthLoader";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";

interface PhotoGalleryProps {
  photos: Photo[];
  avatar?: string;
  name: string;
  username: string;
}

export const PhotoGallery = ({
  photos,
  avatar,
  name,
  username,
}: PhotoGalleryProps) => {
  const t = useTranslations();
  const currentUser = useAuthStore((state) => state.currentUser);
  const isOwner = currentUser?.username === username;
  const {
    localPhotos,
    isUploadOpen,
    setIsUploadOpen,
    addPhoto,
    deletePhoto,
    handleLikeChange,
  } = usePhotoGallery(photos, username);
  const { selectedIndex, setSelectedIndex, handlePrev, handleNext } =
    usePhotoNavigation(localPhotos);

  const selectedPhoto =
    selectedIndex !== null ? localPhotos[selectedIndex] : null;
  const isEmpty = localPhotos.length === 0;

  return (
    <AuthLoader fallback={<PhotoGallerySkeleton />}>
      <section className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {t("photoGallery.title")}
            <span className={styles.count}>{localPhotos.length}</span>
          </h1>
          {isOwner && (
            <Button appearance="primary" onClick={() => setIsUploadOpen(true)}>
              {t("common.addPhoto")}
            </Button>
          )}
        </div>

        {isEmpty ? (
          <EmptyState
            compact
            title={t("common.noPhotosYet")}
            text={t("photoGallery.emptyPhotosText")}
          />
        ) : (
          <PhotoGrid
            photos={localPhotos}
            name={name}
            onSelect={setSelectedIndex}
          />
        )}

        {selectedPhoto && (
          <PhotoModal
            photo={selectedPhoto}
            author={{ avatar, name, username }}
            navigation={{
              currentIndex: selectedIndex ?? 0,
              photosCount: localPhotos.length,
              onPrev: handlePrev,
              onNext: handleNext,
            }}
            isOwner={isOwner}
            onClose={() => setSelectedIndex(null)}
            onDelete={() =>
              deletePhoto(selectedPhoto.id, () => setSelectedIndex(null))
            }
            onLikeChange={handleLikeChange}
          />
        )}

        <PhotoUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onUpload={addPhoto}
        />
      </section>
    </AuthLoader>
  );
};
