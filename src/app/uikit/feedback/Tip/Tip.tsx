import { PiDogFill } from "react-icons/pi";
import { Card } from "@/app/uikit/layout/Card/Card";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
import styles from "./Tip.module.scss";

interface TipProps {
  title: string;
  text: string;
  withIcon?: boolean;
}

export const Tip = ({ title, text, withIcon }: TipProps) => {
  return (
    <Card as="section">
      <CardTitle className={styles.title}>
        {withIcon && <PiDogFill size={22} className={styles.icon} />}
        {title}
      </CardTitle>
      <p className={styles.text}>{text}</p>
    </Card>
  );
};
