"use client";

import { useRef, useState } from "react";
import { MdAddPhotoAlternate, MdDelete } from "react-icons/md";
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
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";
import { Dropdown } from "@/app/uikit/overlays/Dropdown/Dropdown";
import { Card } from "@/app/uikit/layout/Card/Card";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";

const PHOTO_TYPES = "image/jpeg,image/png,image/gif,image/webp";

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
    deleteAllPhotos,
    handleLikeChange,
  } = usePhotoGallery(photos, username);
  const {
    selectedIndex,
    setSelectedIndex,
    handlePrev,
    handleNext,
    prevPhoto,
    nextPhoto,
  } = usePhotoNavigation(localPhotos);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const [pickedFiles, setPickedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openUpload = () => {
    const isTouchScreen = window.matchMedia("(hover: none)").matches;
    if (isTouchScreen) {
      fileInputRef.current?.click();
      return;
    }
    setPickedFiles([]);
    setIsUploadOpen(true);
  };

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setPickedFiles(files);
    setIsUploadOpen(true);
  };

  const selectedPhoto =
    selectedIndex !== null ? localPhotos[selectedIndex] : null;
  const isEmpty = localPhotos.length === 0;

  const addPhotoItem = {
    label: t("common.addPhoto"),
    icon: <MdAddPhotoAlternate size={20} />,
    onClick: openUpload,
  };
  const deleteAllItem = {
    label: t("photoGallery.deleteAll"),
    icon: <MdDelete size={20} />,
    onClick: () => setIsDeleteAllOpen(true),
  };
  const menuItems = isEmpty ? [addPhotoItem] : [addPhotoItem, deleteAllItem];

  return (
    <AuthLoader fallback={<PhotoGallerySkeleton />}>
      <Card as="section">
        <div className={styles.header}>
          <CardTitle as="h1" count={localPhotos.length}>
            {isOwner
              ? t("photoGallery.title")
              : t("photoGallery.titleOther", { name })}
          </CardTitle>
          {isOwner && (
            <div className={styles.menu}>
              <Dropdown label={t("photoGallery.manage")} items={menuItems} />
            </div>
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
              prevPhoto,
              nextPhoto,
            }}
            isOwner={isOwner}
            onClose={() => setSelectedIndex(null)}
            onDelete={() =>
              deletePhoto(selectedPhoto.id, () => setSelectedIndex(null))
            }
            onLikeChange={handleLikeChange}
            enableRepost
          />
        )}

        {isOwner && (
          <input
            ref={fileInputRef}
            type="file"
            accept={PHOTO_TYPES}
            multiple
            hidden
            onChange={handlePick}
          />
        )}

        {isUploadOpen && (
          <PhotoUploadModal
            initialFiles={pickedFiles}
            onClose={() => setIsUploadOpen(false)}
            onUpload={addPhoto}
          />
        )}

        <ConfirmModal
          isOpen={isDeleteAllOpen}
          title={t("photoGallery.deleteAllModalTitle", {
            count: localPhotos.length,
          })}
          description={t("common.cannotUndo")}
          confirmLabel={t("photoGallery.deleteAllConfirm")}
          onConfirm={() => deleteAllPhotos(() => setIsDeleteAllOpen(false))}
          onClose={() => setIsDeleteAllOpen(false)}
        />
      </Card>
    </AuthLoader>
  );
};
