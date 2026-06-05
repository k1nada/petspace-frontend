import styles from "./SidebarSkeleton.module.scss";

const NAV_LINKS_COUNT = 7;

export const SidebarSkeleton = () => (
  <nav className={styles.container}>
    <div className={styles.list}>
      {Array.from({ length: NAV_LINKS_COUNT }, (_, i) => (
        <div key={i} className={styles.item}>
          <div className={styles.icon} />
          <div className={styles.label} />
        </div>
      ))}
    </div>
    <div className={styles.tip} />
  </nav>
);