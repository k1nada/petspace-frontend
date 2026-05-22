import styles from "./Sidebar.module.scss";

export const SidebarSkeleton = () => (
  <nav className={styles.container}>
    <div className={styles.list}>
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} className={styles.skeletonItem} />
      ))}
    </div>
    <div className={styles.skeletonTip} />
  </nav>
);