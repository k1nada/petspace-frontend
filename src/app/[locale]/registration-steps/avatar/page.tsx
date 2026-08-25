import { RegistrationStepsAvatar } from "@/app/features/auth/RegistrationStepsAvatar/RegistrationStepsAvatar";
import styles from "./page.module.scss";
import { Footer } from "@/app/components/Footer/Footer";

const RegistrationStepsAvatarPage = () => {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <RegistrationStepsAvatar />
      </div>
      <Footer />
    </main>
  );
};

export default RegistrationStepsAvatarPage;
