"use client";

import { useDropzone } from "react-dropzone";
import { useState } from "react";
import Image from "next/image";
import { MdPhotoCamera } from "react-icons/md";
import styles from "./PhotoUploadModal.module.scss";
import { Modal } from "@/app/uikit/overlays/Modal/Modal";
import { Button } from "@/app/uikit/form/Button/Button";
import { useTranslations } from "next-intl";

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => Promise<void>;
}

export const PhotoUploadModal = ({
  isOpen,
  onClose,
  onUpload,
}: PhotoUploadModalProps) => {
  const t = useTranslations();
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/webp": [],
    },
    multiple: true,
    disabled: isUploading,
    onDrop: (dropped) => {
      previews.forEach((url) => URL.revokeObjectURL(url));
      setFiles(dropped);
      setPreviews(dropped.map((f) => URL.createObjectURL(f)));
    },
  });

  const handleClose = () => {
    if (isUploading) return;
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviews([]);
    onClose();
  };

  const handleUpload = async () => {
    if (!files.length || isUploading) return;
    setIsUploading(true);
    await onUpload(files);
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviews([]);
    setIsUploading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h3 className={styles.title}>{t("common.addPhoto")}</h3>

      <div {...getRootProps()} className={styles.dropzone}>
        <input {...getInputProps()} />
        {previews.length > 0 ? (
          <div className={styles.previews}>
            {previews.map((src, i) => (
              <div key={i} className={styles.previewItem}>
                <Image
                  src={src}
                  alt={t("common.preview")}
                  fill
                  unoptimized
                  className={styles.preview}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.placeholder}>
            <MdPhotoCamera size={40} />
            <p className={styles.dropzoneText}>
              {t("photoUploadModal.dragAndDrop")}
            </p>
            <p className={styles.dropzoneHint}>{t("common.imageFormats")}</p>
          </div>
        )}
        <div className={styles.overlay}></div>
      </div>

      <div className={styles.actions}>
        <Button
          appearance="secondary"
          onClick={handleClose}
          disabled={isUploading}
        >
          {t("common.cancel")}
        </Button>
        <Button
          appearance="primary"
          onClick={handleUpload}
          disabled={!files.length || isUploading}
        >
          {t("common.upload")} {files.length > 1 && `(${files.length})`}
        </Button>
      </div>
    </Modal>
  );
};
