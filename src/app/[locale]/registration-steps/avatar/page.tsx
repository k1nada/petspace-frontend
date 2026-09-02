import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RegistrationStepsAvatar } from "@/app/features/auth/RegistrationStepsAvatar/RegistrationStepsAvatar";
import styles from "./page.module.scss";
import { Footer } from "@/app/components/Footer/Footer";

interface RegistrationStepsAvatarPageProps {
  params: Promise<{ locale: string }>;
}

export const generateMetadata = async ({
  params,
}: RegistrationStepsAvatarPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("metadata.registrationStepsAvatar.title"),
    description: t("metadata.registrationStepsAvatar.description"),
  };
};

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
