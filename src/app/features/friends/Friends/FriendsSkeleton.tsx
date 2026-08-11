import styles from "./FriendsSkeleton.module.scss";

const TABS_COUNT = 4;
const ROWS_COUNT = 3;

export const FriendsSkeleton = () => (
  <section className={styles.container}>
    <div className={styles.header}>
      {Array.from({ length: TABS_COUNT }, (_, i) => (
        <div key={i} className={styles.tab} />
      ))}
    </div>
    <ul className={styles.list}>
      {Array.from({ length: ROWS_COUNT }, (_, i) => (
        <li key={i} className={styles.row}>
          <div className={styles.avatar} />
          <div className={styles.info}>
            <div className={styles.name} />
            <div className={styles.status} />
          </div>
          <div className={styles.button} />
        </li>
      ))}
    </ul>
  </section>
);
