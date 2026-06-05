import { Logo } from "@/app/uikit/brand/Logo/Logo";
import styles from "./HeaderSkeleton.module.scss";

const HEADER_LINKS_COUNT = 5;

export const HeaderSkeleton = () => (
  <header className={styles.header}>
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.logo}>
          <Logo />
          <span className={styles.logoTitle}>Petspace</span>
        </div>
      </div>
      <div className={styles.search} />
      <div className={styles.list}>
        {Array.from({ length: HEADER_LINKS_COUNT }, (_, i) => (
          <div key={i} className={styles.item} />
        ))}
      </div>
    </div>
  </header>
);
