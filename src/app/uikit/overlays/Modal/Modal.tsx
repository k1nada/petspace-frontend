import styles from "./Modal.module.scss";
import { ReactNode } from "react";
import cn from "classnames";

interface ModalProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ className, isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.container} onClick={onClose}>
      <div
        className={cn(styles.modal, className)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
