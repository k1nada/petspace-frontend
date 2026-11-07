"use client";

import { ReactNode } from "react";
import { createPortal } from "react-dom";
import cn from "classnames";
import styles from "./Modal.module.scss";

interface ModalProps {
  className?: string;
  overlayClassName?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({
  className,
  overlayClassName,
  isOpen,
  onClose,
  children,
}: ModalProps) => {
  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className={cn(styles.container, overlayClassName)} onClick={onClose}>
      <div
        className={cn(styles.modal, className)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};
