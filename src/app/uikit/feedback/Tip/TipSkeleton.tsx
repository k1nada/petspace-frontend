import { SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { Card } from "@/app/uikit/layout/Card/Card";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
import styles from "./Tip.module.scss";

interface TipSkeletonProps {
  title: string;
  text: string;
}

export const TipSkeleton = ({ title, text }: TipSkeletonProps) => (
  <Card as="section">
    <CardTitle>
      <SkeletonText>{title}</SkeletonText>
    </CardTitle>
    <p className={styles.text}>
      <SkeletonText>{text}</SkeletonText>
    </p>
  </Card>
);
