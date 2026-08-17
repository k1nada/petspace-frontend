import styles from "./ContactListSkeleton.module.scss";

const CONTACTS_COUNT = 6;

export const ContactListSkeleton = () => (
  <div className={styles.container}>
    <div className={styles.toolbar}>
      <div className={styles.title} />
      <div className={styles.search} />
    </div>
    <ul className={styles.list}>
      {Array.from({ length: CONTACTS_COUNT }, (_, i) => (
        <li key={i} className={styles.contact}>
          <div className={styles.avatar} />
          <div className={styles.info}>
            <div className={styles.name} />
            <div className={styles.text} />
          </div>
        </li>
      ))}
    </ul>
  </div>
);
