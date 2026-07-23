import styles from "./EmptyState.module.scss";
import { ReactNode } from "react";
import cn from "classnames";

interface EmptyStateProps {
  title?: string;
  text: ReactNode;
  action?: ReactNode;
  compact?: boolean;
  center?: boolean;
}

export const EmptyState = ({
  title,
  text,
  action,
  compact,
  center,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(styles.empty, {
        [styles.compact]: compact,
        [styles.center]: center,
      })}
    >
      {title && <p className={styles.title}>{title}</p>}
      <p className={styles.text}>{text}</p>
      {action}
    </div>
  );
};
