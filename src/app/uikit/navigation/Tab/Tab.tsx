"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/app/uikit/form/Button/Button";
import styles from "./Tab.module.scss";

interface TabProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  dataCy?: string;
}

export const Tab = ({ label, count, isActive, onClick, dataCy }: TabProps) => {
  const tabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const tab = tabRef.current;
    const list = tab?.parentElement;
    if (!isActive || !tab || !list) return;

    const tabRect = tab.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    const padding = parseFloat(getComputedStyle(list).paddingLeft);
    const visibleLeft = listRect.left + padding;
    const visibleRight = listRect.right - padding;

    if (tabRect.left < visibleLeft) {
      list.scrollLeft -= visibleLeft - tabRect.left;
    }

    if (tabRect.right > visibleRight) {
      list.scrollLeft += tabRect.right - visibleRight;
    }
  }, [isActive]);

  return (
    <Button
      ref={tabRef}
      appearance="ghost"
      className={isActive ? styles.tabActive : styles.tab}
      onClick={onClick}
      data-cy={dataCy}
    >
      <span className={styles.title}>{label}</span>
      <span className={styles.count}>{count}</span>
    </Button>
  );
};
