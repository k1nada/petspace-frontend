import styles from "./Postwall.module.scss";
import { PostSkeleton } from "@/app/features/profile/feed/Post/PostSkeleton";
import { Card } from "@/app/uikit/layout/Card/Card";

const SKELETON_COUNT = 3;

export const PostwallSkeleton = () => (
  <Card>
    <ul className={styles.list}>
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <li key={i}>
          <PostSkeleton />
        </li>
      ))}
    </ul>
  </Card>
);
