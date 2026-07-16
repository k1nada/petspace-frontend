import { Button } from "../../form/Button/Button";
import styles from "./Tab.module.scss";

interface TabProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

export const Tab = ({ label, count, isActive, onClick }: TabProps) => (
  <Button
    appearance="ghost"
    className={isActive ? styles.tabActive : styles.tab}
    onClick={onClick}
  >
    <span className={styles.title}>{label}</span>
    <span className={styles.count}>{count}</span>
  </Button>
);
