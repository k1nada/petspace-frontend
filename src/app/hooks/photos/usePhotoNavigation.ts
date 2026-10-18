import { Photo } from "@/types";
import { useState } from "react";

export const usePhotoNavigation = (photos: Photo[]) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = () => {
    if (selectedIndex === null) return;
    if (selectedIndex === 0) {
      setSelectedIndex(photos.length - 1);
    } else {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    if (selectedIndex === photos.length - 1) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  let prevPhoto: Photo | null = null;
  let nextPhoto: Photo | null = null;
  if (selectedIndex !== null && photos.length > 1) {
    prevPhoto =
      photos[selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1];
    nextPhoto =
      photos[selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1];
  }

  return {
    selectedIndex,
    setSelectedIndex,
    handlePrev,
    handleNext,
    prevPhoto,
    nextPhoto,
  };
};
