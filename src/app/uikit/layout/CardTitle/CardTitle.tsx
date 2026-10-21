import { ReactNode } from "react";
import cn from "classnames";
import styles from "./CardTitle.module.scss";

interface CardTitleProps {
  as?: "h1" | "h2";
  count?: number;
  className?: string;
  children: ReactNode;
}

export const CardTitle = ({
  as = "h2",
  count,
  className,
  children,
}: CardTitleProps) => {
  const content = (
    <>
      {children}
      {count !== undefined && <span className={styles.count}>{count}</span>}
    </>
  );

  if (as === "h1") {
    return <h1 className={cn(styles.title, className)}>{content}</h1>;
  }

  return <h2 className={cn(styles.title, className)}>{content}</h2>;
};
