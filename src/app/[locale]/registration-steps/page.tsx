"use client";

import RegistrationSteps from "@/app/features/auth/RegistrationSteps/RegistrationSteps";
import styles from "./page.module.scss";
import { Footer } from "@/app/components/Footer/Footer";
import { useAuthStore } from "@/app/hooks/useAuthStore";

const RegistrationStepsPage = () => {
  const currentUser = useAuthStore((state) => state.currentUser);

  if (!currentUser) return null;

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <RegistrationSteps />
      </div>
      <Footer />
    </main>
  );
};

export default RegistrationStepsPage;
