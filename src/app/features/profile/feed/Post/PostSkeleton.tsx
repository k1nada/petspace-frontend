import styles from "./PostSkeleton.module.scss";

const STATS_COUNT = 3;

export const PostSkeleton = () => (
  <article>
    <div className={styles.wrapper}>
      <div className={styles.avatar} />
      <div className={styles.info}>
        <div className={styles.name} />
        <div className={styles.time} />
      </div>
      <div className={styles.dropdown} />
    </div>
    <div className={styles.textLines}>
      <div className={styles.line} />
      <div className={styles.lineShort} />
    </div>
    <div className={styles.stats}>
      {Array.from({ length: STATS_COUNT }, (_, i) => (
        <div key={i} className={styles.stat} />
      ))}
    </div>
  </article>
);
