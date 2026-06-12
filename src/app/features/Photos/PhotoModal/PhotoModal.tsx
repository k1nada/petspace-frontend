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
import dayjs from "dayjs";
import "dayjs/locale/pl";
import "dayjs/locale/en";
import { DropdownMenu } from "@/app/uikit/overlays/DropdownMenu/DropdownMenu";
import api from "@/config/axios";
import { MdDeleteSweep, MdModeEdit } from "react-icons/md";
import { useState, useEffect } from "react";
import { getPhotoComments } from "@/app/api/comment";
import { toast } from "react-toastify";
import { usePhotoKeyNavigation } from "@/app/hooks/usePhotoKeyNavigation";

interface PhotoModalProps {
  photo: Photo | null;
  avatar?: string;
  name: string;
  photosCount?: number;
  currentIndex?: number;
  cloudName: string | undefined;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onDelete?: () => void;
}

export const PhotoModal = ({
  photo,
  avatar,
  name,
  photosCount,
  currentIndex,
  cloudName,
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
  const [commentRefresh, setCommentRefresh] = useState(0);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { handleKeyDown } = usePhotoKeyNavigation({
    onPrev,
    onNext,
  });

  useEffect(() => {
    if (!photo) return;
    getPhotoComments(photo.id).then((data) => {
      if (data) setComments(data);
    });
  }, [photo, commentRefresh]);

  const refreshComments = () => setCommentRefresh((r) => r + 1);

  const deleteComment = async (commentId: string) => {
    await api.delete(`/comments/${commentId}`);
    refreshComments();
  };

  const handleDeletePhoto = async () => {
    try {
      onDelete?.();
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
            <span className={styles.counter}>
              {t("photoModal.counter", {
                current: (currentIndex ?? 0) + 1,
                total: photosCount ?? 0,
              })}
            </span>
            <Button
              className={styles.arrow}
              appearance="ghost"
              onClick={onPrev}
            >
              <FaAngleLeft size={40} />
            </Button>
            <div className={styles.photo}>
              <Image
                src={`https://res.cloudinary.com/${cloudName}/image/upload/${photo.publicId}`}
                alt="Photo"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <Button
              className={styles.arrow}
              appearance="ghost"
              onClick={onNext}
            >
              <FaAngleRight size={40} />
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
                    {dayjs(photo.createdAt).locale(locale).format("D MMM YYYY")}
                  </time>
                </div>
                <div className={styles.dropdown}>
                  <DropdownMenu
                    items={[
                      {
                        label: t("common.edit"),
                        icon: <MdModeEdit size={20} />,
                        onClick: () => {},
                      },
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
              <CommentCreator
                photoId={photo.id}
                avatar={avatar}
                onSuccess={refreshComments}
              />
            </div>
          </div>

          <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
            <h2 className={styles.modalTitle}>{t("photoModal.modalTitle")}</h2>
            <p className={styles.modalDescription}>
              {t("photoModal.modalDescription")}
            </p>
            <div className={styles.actions}>
              <Button
                appearance="secondary"
                onClick={() => setIsDeleteOpen(false)}
              >
                {t("common.cancel")}
              </Button>

              <Button appearance="primary" onClick={() => handleDeletePhoto()}>
                {t("common.delete")}
              </Button>
            </div>
          </Modal>
        </div>
      )}
    </Modal>
  );
};
