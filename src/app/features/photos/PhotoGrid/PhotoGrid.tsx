"use client";

import styles from "./PhotoGrid.module.scss";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Photo } from "@/types";
import { getPhotoUrl } from "@/utils/photo";

interface PhotoGridProps {
  photos: Photo[];
  name: string;
  onSelect: (index: number) => void;
}

export const PhotoGrid = ({ photos, name, onSelect }: PhotoGridProps) => {
  const t = useTranslations();

  return (
    <ul className={styles.gallery}>
      {photos.map((photo, index) => (
        <li key={photo.publicId} className={styles.photo}>
          <Image
            onClick={() => onSelect(index)}
            src={getPhotoUrl(photo)}
            alt={t("photoGallery.photoAlt", { name })}
            fill
          />
        </li>
      ))}
    </ul>
  );
};
