import styles from "./Postwall.module.scss";
import { PostSkeleton } from "../Post/PostSkeleton";
import { Card } from "@/app/uikit/layout/Card/Card";

interface PostwallSkeletonProps {
  count?: number;
}

export const PostwallSkeleton = ({ count = 3 }: PostwallSkeletonProps) => (
  <Card>
    <ul className={styles.list}>
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <PostSkeleton />
        </li>
      ))}
    </ul>
  </Card>
);
