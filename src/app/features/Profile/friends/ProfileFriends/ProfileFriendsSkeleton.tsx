import styles from "./ProfileFriendsSkeleton.module.scss";

const FRIENDS_COUNT = 3;

export const ProfileFriendsSkeleton = () => (
  <section className={styles.container}>
    <div className={styles.title} />
    <ul className={styles.friends}>
      {Array.from({ length: FRIENDS_COUNT }, (_, i) => (
        <li key={i} className={styles.friend}>
          <div className={styles.avatar} />
          <div className={styles.info}>
            <div className={styles.name} />
            <div className={styles.breed} />
          </div>
        </li>
      ))}
    </ul>
  </section>
);