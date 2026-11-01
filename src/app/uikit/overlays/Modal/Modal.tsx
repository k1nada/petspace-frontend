import styles from "./Modal.module.scss";
import { ReactNode } from "react";
import cn from "classnames";

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
  if (!isOpen) return null;

  return (
    <div className={cn(styles.container, overlayClassName)} onClick={onClose}>
      <div
        className={cn(styles.modal, className)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
