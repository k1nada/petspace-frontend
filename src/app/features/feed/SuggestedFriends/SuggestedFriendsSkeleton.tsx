import styles from "./SuggestedFriendsSkeleton.module.scss";

const SUGGESTIONS_COUNT = 3;

export const SuggestedFriendsSkeleton = () => (
  <div className={styles.container}>
    <div className={styles.title} />
    <ul className={styles.list}>
      {Array.from({ length: SUGGESTIONS_COUNT }, (_, i) => (
        <li key={i} className={styles.card}>
          <div className={styles.avatar} />
          <div className={styles.info}>
            <div className={styles.name} />
            <div className={styles.breed} />
          </div>
          <div className={styles.button} />
        </li>
      ))}
    </ul>
  </div>
);
