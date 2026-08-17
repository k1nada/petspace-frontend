import styles from "./ChatSkeleton.module.scss";

const MESSAGES_COUNT = 6;

export const ChatSkeleton = () => (
  <section className={styles.container}>
    <div className={styles.userInfo}>
      <div className={styles.user}>
        <div className={styles.avatar} />
        <div className={styles.info}>
          <div className={styles.name} />
          <div className={styles.status} />
        </div>
      </div>
    </div>
    <ul className={styles.list}>
      {Array.from({ length: MESSAGES_COUNT }, (_, i) => (
        <li key={i} className={styles.message}>
          <div className={styles.bubble} />
        </li>
      ))}
    </ul>
    <div className={styles.inputBar}>
      <div className={styles.input} />
    </div>
  </section>
);
