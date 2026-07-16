"use client";

import styles from "./ConfirmModal.module.scss";
import { Modal } from "@/app/uikit/overlays/Modal/Modal";
import { Button } from "@/app/uikit/form/Button/Button";
import { useTranslations } from "next-intl";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal = ({
  isOpen,
  title,
  description,
  onConfirm,
  onClose,
}: ConfirmModalProps) => {
  const t = useTranslations();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <div className={styles.actions}>
        <Button appearance="secondary" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button appearance="primary" onClick={onConfirm}>
          {t("common.delete")}
        </Button>
      </div>
    </Modal>
  );
};
