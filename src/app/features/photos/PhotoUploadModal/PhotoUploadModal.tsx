"use client";

import { useDropzone } from "react-dropzone";
import { useState } from "react";
import Image from "next/image";
import cn from "classnames";
import { PhotoIcon } from "@/app/uikit/brand/PhotoIcon/PhotoIcon";
import styles from "./PhotoUploadModal.module.scss";
import { Modal } from "@/app/uikit/overlays/Modal/Modal";
import { Button } from "@/app/uikit/form/Button/Button";
import { useTranslations } from "next-intl";
import { MdAdd, MdClose } from "react-icons/md";

interface PhotoUploadModalProps {
  onClose: () => void;
  onUpload: (files: File[]) => Promise<File[]>;
  initialFiles?: File[];
}

export const PhotoUploadModal = ({
  onClose,
  onUpload,
  initialFiles = [],
}: PhotoUploadModalProps) => {
  const t = useTranslations();
  const isTouchScreen = window.matchMedia("(hover: none)").matches;
  const [previews, setPreviews] = useState<string[]>(() =>
    initialFiles.map((file) => URL.createObjectURL(file)),
  );
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/webp": [],
    },
    multiple: true,
    disabled: isUploading,
    onDrop: (dropped) => {
      if (isTouchScreen) {
        setFiles([...files, ...dropped]);
        setPreviews([
          ...previews,
          ...dropped.map((file) => URL.createObjectURL(file)),
        ]);
        return;
      }
      previews.forEach((url) => URL.revokeObjectURL(url));
      setFiles(dropped);
      setPreviews(dropped.map((f) => URL.createObjectURL(f)));
    },
  });

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

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
    try {
      const failedFiles = await onUpload(files);
      const failedPreviews: string[] = [];
      files.forEach((file, i) => {
        if (failedFiles.includes(file)) failedPreviews.push(previews[i]);
        else URL.revokeObjectURL(previews[i]);
      });
      setFiles(failedFiles);
      setPreviews(failedPreviews);
    } finally {
      setIsUploading(false);
    }
  };

  const content = (
    <>
      <h3 className={styles.title}>{t("common.addPhoto")}</h3>

      {isTouchScreen ? (
        <div className={styles.pickedGrid}>
          <input {...getInputProps()} />
          {previews.map((src, i) => (
            <div key={src} className={styles.pickedItem}>
              <Image
                src={src}
                alt={t("common.preview")}
                fill
                unoptimized
                className={styles.preview}
              />
              <button
                type="button"
                className={styles.removePicked}
                title={t("common.remove")}
                onClick={() => removeFile(i)}
                disabled={isUploading}
              >
                <MdClose size={14} />
              </button>
            </div>
          ))}
          <button
            type="button"
            className={styles.addMore}
            onClick={open}
            disabled={isUploading}
          >
            <MdAdd size={26} />
            {t("photoUploadModal.addMore")}
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(styles.dropzone, {
            [styles.uploading]: isUploading,
            [styles.empty]: previews.length === 0,
          })}
        >
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
              <PhotoIcon size={40} />
              <p className={styles.dropzoneText}>
                {t("photoUploadModal.dragAndDrop")}
              </p>
              <p className={styles.dropzoneHint}>{t("common.imageFormats")}</p>
            </div>
          )}
          <div className={styles.overlay} />
        </div>
      )}

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
    </>
  );

  if (isTouchScreen) {
    return <div className={styles.sheet}>{content}</div>;
  }

  return (
    <Modal isOpen onClose={handleClose}>
      {content}
    </Modal>
  );
};
