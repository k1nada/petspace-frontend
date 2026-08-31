import styles from "./PhotoModal.module.scss";
import { Modal } from "@/app/uikit/overlays/Modal/Modal";
import { Photo, RepostState } from "@/types";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { usePhotoKeyNavigation } from "@/app/hooks/photos/usePhotoKeyNavigation";
import { LikeState } from "@/app/hooks/photos/useResolvedLike";
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
  onCommentsRefresh?: () => void;
}

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
  onCommentsRefresh,
}: PhotoModalProps) => {
  const t = useTranslations();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { handleKeyDown } = usePhotoKeyNavigation({
    onPrev: navigation?.onPrev,
    onNext: navigation?.onNext,
  });

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
      {photo && (
        <div
          className={styles.container}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          autoFocus
        >
          <PhotoModalImage
            photo={photo}
            imageUrl={imageUrl}
            currentIndex={navigation?.currentIndex}
            photosCount={navigation?.photosCount}
            onPrev={navigation?.onPrev}
            onNext={navigation?.onNext}
          />

          <PhotoModalDetails
            photo={photo}
            avatar={author.avatar}
            name={author.name}
            username={author.username}
            isOwner={isOwner}
            onDeleteRequest={() => setIsDeleteOpen(true)}
            likeState={likeState}
            onLikeChange={onLikeChange}
            repostState={repostState}
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
