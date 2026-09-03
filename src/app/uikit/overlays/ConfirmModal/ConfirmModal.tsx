"use client";

import { useState } from "react";
import styles from "./ConfirmModal.module.scss";
import { Modal } from "@/app/uikit/overlays/Modal/Modal";
import { Button } from "@/app/uikit/form/Button/Button";
import { useTranslations } from "next-intl";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export const ConfirmModal = ({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
}: ConfirmModalProps) => {
  const t = useTranslations();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    if (isConfirming) return;
    setIsConfirming(true);
    await onConfirm();
    setIsConfirming(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <div className={styles.actions}>
        <Button
          appearance="secondary"
          onClick={onClose}
          disabled={isConfirming}
        >
          {cancelLabel ?? t("common.cancel")}
        </Button>
        <Button
          appearance="primary"
          onClick={handleConfirm}
          disabled={isConfirming}
        >
          {confirmLabel ?? t("common.delete")}
        </Button>
      </div>
    </Modal>
  );
};
