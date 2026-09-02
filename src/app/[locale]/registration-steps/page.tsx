import RegistrationSteps from "@/app/features/auth/RegistrationSteps/RegistrationSteps";
import styles from "./page.module.scss";
import { Footer } from "@/app/components/Footer/Footer";

const RegistrationStepsPage = () => {
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
