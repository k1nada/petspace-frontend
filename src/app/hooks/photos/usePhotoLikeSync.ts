import { Dispatch, SetStateAction, useCallback } from "react";
import { Photo } from "@/types";

export const usePhotoLikeSync = (
  setPhotos: Dispatch<SetStateAction<Photo[]>>,
) =>
  useCallback(
    (photoId: string, liked: boolean, likesCount: number) => {
      setPhotos((prev) =>
        prev.map((p) => (p.id === photoId ? { ...p, liked, likesCount } : p)),
      );
    },
    [setPhotos],
  );
