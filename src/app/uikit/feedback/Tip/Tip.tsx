import styles from "./Tip.module.scss";
import cn from "classnames";

interface TipProps {
  title: string;
  text: string;
  appearance?: "primary" | "secondary";
}

export const Tip = ({ title, text, appearance }: TipProps) => {
  return (
    <div
      className={cn(styles.container, {
        [styles.primary]: appearance === "primary",
        [styles.secondary]: appearance === "secondary",
      })}
    >
      <span className={styles.title}>{title}</span>
      <p className={styles.text}>{text}</p>
    </div>
  );
};
