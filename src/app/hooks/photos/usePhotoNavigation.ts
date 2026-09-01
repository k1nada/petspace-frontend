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

  return { selectedIndex, setSelectedIndex, handlePrev, handleNext };
};
