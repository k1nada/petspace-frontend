"use client";

import { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import styles from "./PageTransition.module.scss";

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname();

  return (
    <div key={pathname} className={styles.page}>
      {children}
    </div>
  );
};
