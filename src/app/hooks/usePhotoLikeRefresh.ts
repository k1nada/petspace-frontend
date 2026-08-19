import { Dispatch, SetStateAction, useEffect } from "react";
import { Photo } from "@/types";
import { getUserPhotos } from "@/app/api/user";

export const usePhotoLikeRefresh = (
  username: string,
  setPhotos: Dispatch<SetStateAction<Photo[]>>,
) => {
  useEffect(() => {
    getUserPhotos(username).then((freshPhotos) => {
      if (!freshPhotos) return;
      setPhotos((prev) =>
        prev.map((photo) => {
          const fresh = freshPhotos.find((f) => f.id === photo.id);
          return fresh
            ? { ...photo, liked: fresh.liked, likesCount: fresh.likesCount }
            : photo;
        }),
      );
    });
  }, [username, setPhotos]);
};
