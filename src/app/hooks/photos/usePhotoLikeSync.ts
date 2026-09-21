import { Dispatch, RefObject, SetStateAction } from "react";
import { Photo } from "@/types";

export const usePhotoLikeSync = (
  setPhotos: Dispatch<SetStateAction<Photo[]>>,
  hasLiked: RefObject<boolean>,
) => {
  return (photoId: string, liked: boolean, likesCount: number) => {
    hasLiked.current = true;
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, liked, likesCount } : p)),
    );
  };
};
