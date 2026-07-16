import styles from "./PhotoGallerySkeleton.module.scss";

const PHOTOS_COUNT = 12;

export const PhotoGallerySkeleton = () => (
  <section className={styles.container}>
    <div className={styles.header}>
      <div className={styles.title} />
      <div className={styles.button} />
    </div>
    <div className={styles.gallery}>
      {Array.from({ length: PHOTOS_COUNT }, (_, i) => (
        <div key={i} className={styles.photo} />
      ))}
    </div>
  </section>
);
