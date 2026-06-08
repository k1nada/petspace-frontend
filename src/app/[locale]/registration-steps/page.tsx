"use client";

import RegistrationSteps from "@/app/features/auth/RegistrationSteps/RegistrationSteps";
import styles from "./page.module.scss";
import { Header } from "@/app/components/Header/Header";

interface RegistrationStepsPageProps {
  username: string;
}

const RegistrationStepsPage = ({ username }: RegistrationStepsPageProps) => {
  return (
    <main className={styles.page}>
      <Header />
      <RegistrationSteps username={username} />
    </main>
  );
};

export default RegistrationStepsPage;
