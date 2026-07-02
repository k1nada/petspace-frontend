import { DetailedHTMLProps, TextareaHTMLAttributes } from "react";
import styles from "./Textarea.module.scss";
import cn from "classnames";

interface TextareaProps extends DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> {
  appearance?: "primary" | "secondary" | "third";
}

export const Textarea = ({ appearance, className, ...rest }: TextareaProps) => {
  return (
    <textarea
      {...rest}
      className={cn(styles.default, className, {
        [styles.primary]: appearance === "primary",
        [styles.secondary]: appearance === "secondary",
        [styles.third]: appearance === "third",
      })}
    />
  );
};
