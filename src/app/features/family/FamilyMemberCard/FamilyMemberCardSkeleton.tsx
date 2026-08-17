import styles from "./FamilyMemberCardSkeleton.module.scss";

export const FamilyMemberCardSkeleton = () => (
  <li className={styles.card}>
    <div className={styles.avatar} />
    <div className={styles.info}>
      <div className={styles.name} />
    </div>
  </li>
);
