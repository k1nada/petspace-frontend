import { ReactNode } from "react";
import styles from "./Card.module.scss";

interface CardProps {
  as?: "div" | "section";
  children: ReactNode;
}

export const Card = ({ as = "div", children }: CardProps) => {
  if (as === "section") {
    return <section className={styles.card}>{children}</section>;
  }

  return <div className={styles.card}>{children}</div>;
};
