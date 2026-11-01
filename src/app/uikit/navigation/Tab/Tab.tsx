"use client";

import { useEffect, useRef } from "react";
import { Button } from "../../form/Button/Button";
import styles from "./Tab.module.scss";

interface TabProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

export const Tab = ({ label, count, isActive, onClick }: TabProps) => {
  const tabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isActive) {
      tabRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }, [isActive]);

  return (
    <Button
      ref={tabRef}
      appearance="ghost"
      className={isActive ? styles.tabActive : styles.tab}
      onClick={onClick}
    >
      <span className={styles.title}>{label}</span>
      <span className={styles.count}>{count}</span>
    </Button>
  );
};
