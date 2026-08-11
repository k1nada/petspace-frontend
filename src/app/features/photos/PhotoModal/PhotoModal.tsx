import { Modal } from "@/app/uikit/overlays/Modal/Modal";
import Image from "next/image";
import styles from "./PhotoModal.module.scss";
import { Comment as CommentType, Photo } from "@/types";
import { Button } from "@/app/uikit/form/Button/Button";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useLocale, useTranslations } from "next-intl";
import { Comment } from "../../profile/feed/Comment/Comment";
import { CommentCreator } from "../../profile/feed/CommentCreator/CommentCreator";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import "dayjs/locale/pl";
import "dayjs/locale/en";
import { DropdownMenu } from "@/app/uikit/overlays/DropdownMenu/DropdownMenu";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";
import api from "@/config/axios";
import { MdDeleteSweep } from "react-icons/md";
import { useState, useEffect } from "react";
import { getPhotoComments } from "@/app/api/comment";
import { toast } from "react-toastify";
import { usePhotoKeyNavigation } from "@/app/hooks/usePhotoKeyNavigation";
import { formatDate } from "@/utils/dateFormatters";
import { getPhotoUrl } from "@/utils/photo";

interface PhotoModalProps {
  photo: Photo | null;
  avatar?: string;
  name: string;
  photosCount?: number;
  currentIndex?: number;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onDelete?: () => void | Promise<void>;
}

export const PhotoModal = ({
  photo,
  avatar,
  name,
  photosCount,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  onDelete,
}: PhotoModalProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const [comments, setComments] = useState<CommentType[]>(
    photo?.comments ?? [],
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { handleKeyDown } = usePhotoKeyNavigation({
    onPrev,
    onNext,
  });

  const photoId = photo?.id;

  const refreshComments = () => {
    if (!photoId) return;
    getPhotoComments(photoId).then((data) => {
      if (data) setComments(data);
    });
  };

  useEffect(refreshComments, [photoId]);

  const deleteComment = async (commentId: string) => {
    try {
      await api.delete(`/comments/${commentId}`);
      refreshComments();
    } catch {
      toast.error(t("toasts.error"));
    }
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
      {photo && (
        <div
          className={styles.container}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          autoFocus
        >
          <div className={styles.photoWrapper}>
            <div className={styles.photoBackground}>
              <Image
                src={getPhotoUrl(photo)}
                alt=""
                fill
                className={styles.imageBackground}
              />
            </div>
            <span className={styles.counter}>
              {t("photoModal.counter", {
                current: (currentIndex ?? 0) + 1,
                total: photosCount ?? 0,
              })}
            </span>
            <Button
              className={`${styles.arrow} ${styles.arrowLeft}`}
              appearance="ghost"
              onClick={onPrev}
            >
              <FaAngleLeft size={30} />
            </Button>
            <div className={styles.photo}>
              <Image
                src={getPhotoUrl(photo)}
                alt={t("postCreator.photo")}
                fill
                className={styles.photoImage}
              />
            </div>
            <Button
              className={`${styles.arrow} ${styles.arrowRight}`}
              appearance="ghost"
              onClick={onNext}
            >
              <FaAngleRight size={30} />
            </Button>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.sidebarWrapper}>
              <div className={styles.author}>
                <div className={styles.avatar}>
                  <Avatar src={avatar} />
                </div>
                <div className={styles.info}>
                  <div className={styles.name}>{name}</div>
                  <time className={styles.time}>
                    {formatDate(photo.createdAt, locale)}
                  </time>
                </div>
                <div className={styles.dropdown}>
                  <DropdownMenu
                    items={[
                      {
                        label: t("common.delete"),
                        icon: <MdDeleteSweep size={20} />,
                        onClick: () => {
                          setIsDeleteOpen(true);
                        },
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
            <ul className={styles.comments}>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <li key={comment.id}>
                    <Comment
                      comment={comment}
                      onDelete={() => deleteComment(comment.id)}
                    />
                  </li>
                ))
              ) : (
                <div className={styles.emptyComments}>
                  <p className={styles.title}>
                    {t("photoModal.commentsTitle")}
                  </p>
                  <p className={styles.text}>{t("photoModal.commentsText")}</p>
                </div>
              )}
            </ul>
            <div className={styles.sidebarFooter}>
              <CommentCreator photoId={photo.id} onSuccess={refreshComments} />
            </div>
          </div>

          <ConfirmModal
            isOpen={isDeleteOpen}
            title={t("photoModal.modalTitle")}
            description={t("photoModal.modalDescription")}
            onConfirm={handleDeletePhoto}
            onClose={() => setIsDeleteOpen(false)}
          />
        </div>
      )}
    </Modal>
  );
};
