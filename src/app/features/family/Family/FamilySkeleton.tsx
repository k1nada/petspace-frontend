import styles from "./FamilySkeleton.module.scss";
import { FamilyColumnSkeleton } from "@/app/features/family/FamilyColumn/FamilyColumnSkeleton";

export const FamilySkeleton = () => (
  <section className={styles.container}>
    <div className={styles.title} />
    <div className={styles.content}>
      <FamilyColumnSkeleton />
      <div className={styles.divider} />
      <div className={styles.user}>
        <div className={styles.avatar} />
        <div className={styles.name} />
      </div>
      <div className={styles.divider} />
      <FamilyColumnSkeleton />
    </div>
  </section>
);
