import { ReactNode } from "react";
import styles from "./CardTitle.module.scss";

interface CardTitleProps {
  as?: "h1" | "h2";
  children: ReactNode;
}

export const CardTitle = ({ as = "h2", children }: CardTitleProps) => {
  if (as === "h1") {
    return <h1 className={styles.title}>{children}</h1>;
  }

  return <h2 className={styles.title}>{children}</h2>;
};
