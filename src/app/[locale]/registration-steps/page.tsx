import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import RegistrationSteps from "@/app/features/auth/RegistrationSteps/RegistrationSteps";
import styles from "./page.module.scss";
import { Footer } from "@/app/components/Footer/Footer";

interface RegistrationStepsPageProps {
  params: Promise<{ locale: string }>;
}

export const generateMetadata = async ({
  params,
}: RegistrationStepsPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("metadata.registrationSteps.title"),
    description: t("metadata.registrationSteps.description"),
  };
};

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
