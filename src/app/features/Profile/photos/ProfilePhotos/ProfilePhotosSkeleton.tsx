import styles from "./ProfilePhotosSkeleton.module.scss";

const PHOTOS_COUNT = 6;

export const ProfilePhotosSkeleton = () => (
  <section className={styles.container}>
    <div className={styles.title} />
    <div className={styles.gallery}>
      {Array.from({ length: PHOTOS_COUNT }, (_, i) => (
        <div key={i} className={styles.photo} />
      ))}
    </div>
  </section>
);