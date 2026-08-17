import styles from "./ProfileInterestsSkeleton.module.scss";

const FIELDS_COUNT = 6;

export const ProfileInterestsSkeleton = () => (
  <div className={styles.container}>
    <div className={styles.title} />
    <div className={styles.fields}>
      {Array.from({ length: FIELDS_COUNT }, (_, i) => (
        <div key={i} className={styles.field}>
          <div className={styles.label} />
          <div className={styles.textarea} />
        </div>
      ))}
    </div>
    <div className={styles.actions}>
      <div className={styles.button} />
      <div className={styles.button} />
    </div>
  </div>
);
