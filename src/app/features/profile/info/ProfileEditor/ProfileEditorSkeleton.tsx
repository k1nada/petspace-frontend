import styles from "./ProfileEditorSkeleton.module.scss";

const FIELDS_COUNT = 6;

export const ProfileEditorSkeleton = () => (
  <div className={styles.container}>
    <div className={styles.title} />
    <div className={styles.profileContent}>
      <div className={styles.avatar} />
      <div className={styles.userInfo}>
        <div className={styles.name} />
        <div className={styles.username} />
      </div>
    </div>
    <div className={styles.fields}>
      {Array.from({ length: FIELDS_COUNT }, (_, i) => (
        <div key={i} className={styles.field}>
          <div className={styles.label} />
          <div className={styles.input} />
        </div>
      ))}
    </div>
    <div className={styles.field}>
      <div className={styles.label} />
      <div className={styles.textarea} />
    </div>
    <div className={styles.actions}>
      <div className={styles.button} />
      <div className={styles.button} />
    </div>
  </div>
);
