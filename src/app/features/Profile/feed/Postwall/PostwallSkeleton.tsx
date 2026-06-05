import styles from "./PostwallSkeleton.module.scss";

const SKELETON_COUNT = 3;

export const PostwallSkeleton = () => (
  <div className={styles.container}>
    {Array.from({ length: SKELETON_COUNT }, (_, i) => (
      <div key={i} className={styles.post} />
    ))}
  </div>
);