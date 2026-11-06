import { ReactNode } from "react";
import { Button } from "../Button/Button";
import styles from "./IconButton.module.scss";

interface IconButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  accent?: boolean;
}

export const IconButton = ({
  icon,
  label,
  onClick,
  disabled,
  accent,
}: IconButtonProps) => (
  <Button
    appearance={accent ? "primary" : "secondary"}
    className={styles.iconButton}
    title={label}
    onClick={onClick}
    disabled={disabled}
  >
    {icon}
  </Button>
);
