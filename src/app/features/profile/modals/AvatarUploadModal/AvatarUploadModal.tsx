"use client";

import { useDropzone } from "react-dropzone";
import { useEffect, useState } from "react";
import { Avatar } from "../../../../uikit/user/Avatar/Avatar";
import { MdPhotoCamera } from "react-icons/md";
import styles from "./AvatarUploadModal.module.scss";

interface AvatarUploadModalProps {
  size?: number;
  onChange?: (file: File) => void;
  profileAvatar?: string;
  disabled?: boolean;
}

export const AvatarUploadModal = ({
  size = 120,
  onChange,
  profileAvatar,
  disabled,
}: AvatarUploadModalProps) => {
  const [preview, setPreview] = useState(profileAvatar);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/webp": [],
    },
    disabled,
    onDrop: (files) => {
      const file = files[0];
      const fileUrl = URL.createObjectURL(file);
      setPreview(fileUrl);
      onChange?.(file);
    },
  });

  return (
    <div
      {...getRootProps()}
      className={styles.wrapper}
      style={{ width: size, height: size, opacity: disabled ? 0.6 : 1 }}
    >
      <input {...getInputProps()} />
      <Avatar size={size} src={preview} />
      <div className={styles.overlay}>
        <MdPhotoCamera size={24} />
      </div>
    </div>
  );
};
