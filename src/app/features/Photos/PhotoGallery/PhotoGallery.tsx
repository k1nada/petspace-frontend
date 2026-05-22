"use client";

import { Button } from "@/app/uikit/form/Button/Button";
import styles from "./PhotoGallery.module.scss";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { PhotoModal } from "../PhotoModal/PhotoModal";
import { CLOUD_NAME } from "@/config/env";
import { toast } from "react-toastify";
import { usePhotoNavigation } from "@/app/hooks/usePhotoNavigation";
import { PhotoUploadModal } from "../PhotoUploadModal/PhotoUploadModal";
import api from "@/config/axios";
import { Photo } from "@/types";

interface PhotoGalleryProps {
  photos: Photo[];
  avatar?: string;
  name: string;
}

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/api/upload/photo", formData);
  return {
    id: data.data._id,
    publicId: data.data.public_id,
    createdAt: data.data.createdAt,
    liked: false,
    likesCount: 0,
  };
};

export const PhotoGallery = ({ photos, avatar, name }: PhotoGalleryProps) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [localPhotos, setLocalPhotos] = useState<Photo[]>(photos);

  const { selectedIndex, setSelectedIndex, handlePrev, handleNext } =
    usePhotoNavigation(localPhotos);

  const selectedPhoto =
    selectedIndex !== null ? localPhotos[selectedIndex] : null;

  const addPhoto = async (files: File[]) => {
    try {
      const uploaded = await Promise.all(files.map(uploadFile));
      setLocalPhotos((prev) => [...prev, ...uploaded]);
      setIsOpen(false);
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      await api.delete(`/api/upload/photo/${photoId}`);
      setLocalPhotos((prev) => prev.filter((p) => p.id !== photoId));
      setSelectedIndex(null);
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {t("photoGallery.title")}
          <span className={styles.count}>{localPhotos.length}</span>
        </h1>
        <Button appearance="primary" onClick={() => setIsOpen(true)}>
          {t("photoGallery.addPhoto")}
        </Button>
      </div>

      {localPhotos.length === 0 ? (
        <div className={styles.emptyPhotos}>
          <p className={styles.emptyTitle}>{t("photoGallery.emptyPhotosTitle")}</p>
          <p className={styles.emptyText}>{t("photoGallery.emptyPhotosText")}</p>
        </div>
      ) : (
        <ul className={styles.gallery}>
          {localPhotos.map((photo, index) => (
            <li key={photo.publicId} className={styles.photo}>
              <Image
                onClick={() => setSelectedIndex(index)}
                src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${photo.publicId}`}
                alt={`${name}'s photo`}
                fill
              />
            </li>
          ))}
        </ul>
      )}

      <PhotoModal
        photo={selectedPhoto}
        avatar={avatar}
        name={name}
        cloudName={CLOUD_NAME}
        currentIndex={selectedIndex ?? 0}
        photosCount={localPhotos.length}
        onClose={() => setSelectedIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
        onDelete={() => selectedPhoto && deletePhoto(selectedPhoto.id)}
      />

      <PhotoUploadModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onUpload={addPhoto}
      />
    </section>
  );
};
