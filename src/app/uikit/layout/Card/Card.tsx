import { ReactNode } from "react";
import cn from "classnames";
import styles from "./Card.module.scss";

interface CardProps {
  as?: "div" | "section";
  className?: string;
  children: ReactNode;
}

export const Card = ({ as = "div", className, children }: CardProps) => {
  if (as === "section") {
    return <section className={cn(styles.card, className)}>{children}</section>;
  }

  return <div className={cn(styles.card, className)}>{children}</div>;
};
