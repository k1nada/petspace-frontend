import styles from "./PhotoModal.module.scss";
import { Modal } from "@/app/uikit/overlays/Modal/Modal";
import { Photo } from "@/types";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { usePhotoKeyNavigation } from "@/app/hooks/usePhotoKeyNavigation";
import { usePhotoComments } from "@/app/hooks/usePhotoComments";
import { useResolvedLike, LikeState } from "@/app/hooks/useResolvedLike";
import { PhotoModalImage } from "../PhotoModalImage/PhotoModalImage";
import { PhotoModalDetails } from "../PhotoModalDetails/PhotoModalDetails";

interface PhotoModalProps {
  photo: Photo | null;
  imageUrl?: string;
  postId?: string;
  avatar?: string;
  name: string;
  photosCount?: number;
  currentIndex?: number;
  isOwner?: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onDelete?: () => void | Promise<void>;
  onLikeChange?: (photoId: string, liked: boolean, likesCount: number) => void;
  likeState?: LikeState;
  onCommentsRefresh?: () => void;
}

export const PhotoModal = ({
  photo,
  imageUrl,
  postId,
  avatar,
  name,
  photosCount,
  currentIndex,
  isOwner,
  onClose,
  onPrev,
  onNext,
  onDelete,
  onLikeChange,
  likeState,
  onCommentsRefresh,
}: PhotoModalProps) => {
  const t = useTranslations();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { handleKeyDown } = usePhotoKeyNavigation({ onPrev, onNext });

  const { comments, refreshComments, deleteComment } = usePhotoComments({
    photo,
    postId,
    onCommentsRefresh,
  });

  const { liked, displayCount, likeLoading, toggleLike } = useResolvedLike({
    photo,
    postId,
    likeState,
    onLikeChange,
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
            currentIndex={currentIndex}
            photosCount={photosCount}
            onPrev={onPrev}
            onNext={onNext}
          />

          <PhotoModalDetails
            photo={photo}
            avatar={avatar}
            name={name}
            isOwner={isOwner}
            onDeleteRequest={() => setIsDeleteOpen(true)}
            liked={liked}
            displayCount={displayCount}
            likeLoading={likeLoading}
            onToggleLike={toggleLike}
            comments={comments}
            onDeleteComment={deleteComment}
            postId={postId}
            onCommentSuccess={refreshComments}
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
