import { RegistrationStepsAvatar } from "@/app/features/auth/RegistrationStepsAvatar/RegistrationStepsAvatar";
import styles from "./page.module.scss";
import { Header } from "@/app/components/Header/Header";

const RegistrationStepsAvatarPage = () => {
  return (
    <main className={styles.page}>
      <Header />
      <RegistrationStepsAvatar />
    </main>
  );
};

export default RegistrationStepsAvatarPage;
