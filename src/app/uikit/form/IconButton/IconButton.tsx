import { ReactNode } from "react";
import cn from "classnames";
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
    className={cn(styles.iconButton, { [styles.quiet]: !accent })}
    title={label}
    onClick={onClick}
    disabled={disabled}
  >
    {icon}
  </Button>
);
