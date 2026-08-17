import styles from "./PostwallSkeleton.module.scss";
import { PostSkeleton } from "@/app/features/profile/feed/Post/PostSkeleton";

const SKELETON_COUNT = 3;

export const PostwallSkeleton = () => (
  <div className={styles.container}>
    <ul className={styles.list}>
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <li key={i}>
          <PostSkeleton />
        </li>
      ))}
    </ul>
  </div>
);
