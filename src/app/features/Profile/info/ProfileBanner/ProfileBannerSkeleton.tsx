import styles from "./ProfileBannerSkeleton.module.scss";

export const ProfileBannerSkeleton = () => (
  <div className={styles.banner}>
    <div className={styles.avatar} />
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.nameWrapper}>
          <div className={styles.name} />
          <div className={styles.username} />
        </div>
        <div className={styles.city} />
      </div>
      <div className={styles.bio} />
      <div className={styles.divider} />
      <div className={styles.stats}>
        <div className={styles.stat} />
        <div className={styles.stat} />
        <div className={styles.stat} />
      </div>
    </div>
    <div className={styles.actions}>
      <div className={styles.buttonSmall} />
      <div className={styles.buttonLarge} />
    </div>
  </div>
);