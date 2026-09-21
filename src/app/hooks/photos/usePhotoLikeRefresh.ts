import { Dispatch, RefObject, SetStateAction, useEffect } from "react";
import { Photo } from "@/types";
import { getUserPhotos } from "@/services/api/userClient";

export const usePhotoLikeRefresh = (
  username: string,
  setPhotos: Dispatch<SetStateAction<Photo[]>>,
  hasLiked: RefObject<boolean>,
) => {
  useEffect(() => {
    let cancelled = false;

    getUserPhotos(username)
      .then((freshPhotos) => {
        if (cancelled || hasLiked.current) return;
        setPhotos((prev) =>
          prev.map((photo) => {
            const fresh = freshPhotos.find((f) => f.id === photo.id);
            return fresh
              ? { ...photo, liked: fresh.liked, likesCount: fresh.likesCount }
              : photo;
          }),
        );
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [username, setPhotos, hasLiked]);
};
