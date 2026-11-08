import { PiDogFill } from "react-icons/pi";
import { SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { Card } from "@/app/uikit/layout/Card/Card";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
import styles from "./Tip.module.scss";

interface TipSkeletonProps {
  title: string;
  text: string;
  withIcon?: boolean;
}

export const TipSkeleton = ({ title, text, withIcon }: TipSkeletonProps) => (
  <Card as="section">
    <CardTitle className={styles.title}>
      <SkeletonText>
        {withIcon && <PiDogFill size={22} className={styles.icon} />}
        {title}
      </SkeletonText>
    </CardTitle>
    <p className={styles.text}>
      <SkeletonText>{text}</SkeletonText>
    </p>
  </Card>
);
