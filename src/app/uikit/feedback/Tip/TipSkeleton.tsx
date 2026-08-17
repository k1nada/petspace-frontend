import styles from "./TipSkeleton.module.scss";

export const TipSkeleton = () => (
  <div className={styles.container}>
    <div className={styles.title} />
    <div className={styles.line} />
    <div className={styles.line} />
    <div className={styles.lineShort} />
  </div>
);
