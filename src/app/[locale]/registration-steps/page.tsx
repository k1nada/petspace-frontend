"use client";

import RegistrationSteps from "@/app/features/auth/RegistrationSteps/RegistrationSteps";
import styles from "./page.module.scss";
import { useAuthStore } from "@/app/hooks/useAuthStore";

const RegistrationStepsPage = () => {
  const currentUser = useAuthStore((state) => state.currentUser);

  if (!currentUser) return null;

  return (
    <main className={styles.page}>
      <RegistrationSteps username={currentUser.username} />
    </main>
  );
};

export default RegistrationStepsPage;
