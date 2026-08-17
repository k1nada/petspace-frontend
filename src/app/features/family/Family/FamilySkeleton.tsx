import styles from "./FamilySkeleton.module.scss";
import { FamilyColumnSkeleton } from "@/app/features/family/FamilyColumn/FamilyColumnSkeleton";
import { Divider } from "@/app/uikit/layout/Divider/Divider";

export const FamilySkeleton = () => (
  <section className={styles.container}>
    <div className={styles.title} />
    <div className={styles.content}>
      <FamilyColumnSkeleton />
      <Divider style={{ width: 30, height: 2 }} />
      <div className={styles.user}>
        <div className={styles.avatar} />
        <div className={styles.name} />
      </div>
      <Divider style={{ width: 30, height: 2 }} />
      <FamilyColumnSkeleton />
    </div>
  </section>
);
