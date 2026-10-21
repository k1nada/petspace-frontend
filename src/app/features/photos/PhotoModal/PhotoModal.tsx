"use client";

import styles from "./PhotoModal.module.scss";
import { Modal } from "@/app/uikit/overlays/Modal/Modal";
import { Photo, RepostState } from "@/types";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { LikeState } from "@/app/hooks/photos/useResolvedLike";
import { getModalPhotoUrl, getPhotoUrl } from "@/utils/photo";
import { preloadPhotoComments } from "@/app/hooks/photos/usePhotoComments";
import { PhotoModalImage } from "../PhotoModalImage/PhotoModalImage";
import { PhotoModalDetails } from "../PhotoModalDetails/PhotoModalDetails";

interface PhotoModalAuthor {
  avatar?: string;
  name: string;
  username?: string;
}

interface PhotoModalNavigation {
  photosCount?: number;
  currentIndex?: number;
  onPrev?: () => void;
  onNext?: () => void;
  prevPhoto?: Photo | null;
  nextPhoto?: Photo | null;
}

interface PhotoModalProps {
  photo: Photo | null;
  imageUrl?: string;
  postId?: string;
  author: PhotoModalAuthor;
  navigation?: PhotoModalNavigation;
  isOwner?: boolean;
  onClose: () => void;
  onDelete?: () => void | Promise<void>;
  onLikeChange?: (photoId: string, liked: boolean, likesCount: number) => void;
  likeState?: LikeState;
  repostState?: RepostState;
  enableRepost?: boolean;
  onCommentsRefresh?: () => void;
}

const loadImage = (src: string) => {
  const image = new window.Image();
  image.src = src;
  return image.decode().catch(() => {});
};

export const PhotoModal = ({
  photo,
  imageUrl,
  postId,
  author,
  navigation,
  isOwner,
  onClose,
  onDelete,
  onLikeChange,
  likeState,
  repostState,
  enableRepost,
  onCommentsRefresh,
}: PhotoModalProps) => {
  const t = useTranslations();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [shownPhoto, setShownPhoto] = useState<Photo | null>(photo);
  const [shownIndex, setShownIndex] = useState(navigation?.currentIndex);
  const currentIndex = navigation?.currentIndex;
  const isSwitching = !!photo && !!shownPhoto && photo.id !== shownPhoto.id;

  if (!isSwitching && photo?.id !== shownPhoto?.id) {
    setShownPhoto(photo);
    setShownIndex(currentIndex);
  }

  const visiblePhoto = isSwitching ? shownPhoto : photo;
  const visibleIndex = isSwitching ? shownIndex : currentIndex;
  const getSrc = (item: Photo) =>
    imageUrl ? getModalPhotoUrl(imageUrl) : getModalPhotoUrl(getPhotoUrl(item));
  const nextSrc = photo ? getSrc(photo) : null;

  useEffect(() => {
    if (!isSwitching || !photo || !nextSrc) return;
    let cancelled = false;

    loadImage(nextSrc).then(() => {
      if (cancelled) return;
      setShownPhoto(photo);
      setShownIndex(currentIndex);
    });

    return () => {
      cancelled = true;
    };
  }, [isSwitching, photo, nextSrc, currentIndex]);

  const prevSrc = navigation?.prevPhoto
    ? getModalPhotoUrl(getPhotoUrl(navigation.prevPhoto))
    : null;
  const nextNeighborSrc = navigation?.nextPhoto
    ? getModalPhotoUrl(getPhotoUrl(navigation.nextPhoto))
    : null;

  useEffect(() => {
    if (prevSrc) loadImage(prevSrc);
    if (nextNeighborSrc) loadImage(nextNeighborSrc);
  }, [prevSrc, nextNeighborSrc]);

  const prevPhotoId = navigation?.prevPhoto?.id;
  const nextPhotoId = navigation?.nextPhoto?.id;

  useEffect(() => {
    if (postId) return;
    if (prevPhotoId) preloadPhotoComments(prevPhotoId);
    if (nextPhotoId) preloadPhotoComments(nextPhotoId);
  }, [postId, prevPhotoId, nextPhotoId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") navigation?.onPrev?.();
    if (e.key === "ArrowRight") navigation?.onNext?.();
  };

  const handleDeletePhoto = async () => {
    try {
      await onDelete?.();
      setIsDeleteOpen(false);
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  return (
    <Modal isOpen={photo !== null} onClose={onClose} className={styles.modal}>
      {visiblePhoto && (
        <div
          className={styles.container}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          autoFocus
        >
          <PhotoModalImage
            src={getSrc(visiblePhoto)}
            currentIndex={visibleIndex}
            photosCount={navigation?.photosCount}
            onPrev={navigation?.onPrev}
            onNext={navigation?.onNext}
          />

          <PhotoModalDetails
            photo={visiblePhoto}
            avatar={author.avatar}
            name={author.name}
            username={author.username}
            isOwner={isOwner}
            onDeleteRequest={() => {
              if (!isSwitching) setIsDeleteOpen(true);
            }}
            likeState={likeState}
            onLikeChange={onLikeChange}
            repostState={repostState}
            enableRepost={enableRepost}
            postId={postId}
            onCommentsRefresh={onCommentsRefresh}
          />

          <ConfirmModal
            isOpen={isDeleteOpen}
            title={t("common.deletePhoto")}
            description={t("photoModal.modalDescription")}
            onConfirm={handleDeletePhoto}
            onClose={() => setIsDeleteOpen(false)}
          />
        </div>
      )}
    </Modal>
  );
};
