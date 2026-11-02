import { ReactNode } from "react";
import cn from "classnames";
import styles from "./Card.module.scss";

interface CardProps {
  as?: "div" | "section";
  className?: string;
  children: ReactNode;
  dataCy?: string;
}

export const Card = ({
  as = "div",
  className,
  children,
  dataCy,
}: CardProps) => {
  if (as === "section") {
    return (
      <section className={cn(styles.card, className)} data-cy={dataCy}>
        {children}
      </section>
    );
  }

  return (
    <div className={cn(styles.card, className)} data-cy={dataCy}>
      {children}
    </div>
  );
};
