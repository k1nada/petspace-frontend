import styles from "./Tip.module.scss";
import { Card } from "@/app/uikit/layout/Card/Card";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";

interface TipProps {
  title: string;
  text: string;
}

export const Tip = ({ title, text }: TipProps) => {
  return (
    <Card as="section">
      <CardTitle>{title}</CardTitle>
      <p className={styles.text}>{text}</p>
    </Card>
  );
};
