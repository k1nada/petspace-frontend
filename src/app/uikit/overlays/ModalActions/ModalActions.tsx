import { ReactNode } from "react";
import styles from "./ModalActions.module.scss";

interface ModalActionsProps {
  children: ReactNode;
}

export const ModalActions = ({ children }: ModalActionsProps) => (
  <div className={styles.actions}>{children}</div>
);
