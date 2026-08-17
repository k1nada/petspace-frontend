import { CSSProperties } from "react";
import styles from "./Divider.module.scss";
import cn from "classnames";

interface DividerProps {
  className?: string;
  style?: CSSProperties;
}

export const Divider = ({ className, style }: DividerProps) => (
  <div className={cn(styles.divider, className)} style={style} />
);
