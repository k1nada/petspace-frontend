import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import styles from "./page.module.scss";
import { SignUp } from "@/app/features/auth/SignUp/SignUp";
import { Footer } from "@/app/components/Footer/Footer";

interface SignUpPageProps {
  params: Promise<{ locale: string }>;
}

export const generateMetadata = async ({
  params,
}: SignUpPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("metadata.signup.title"),
    description: t("metadata.signup.description"),
  };
};

export default function SignUpPage() {
  return (
    <>
      <main className={styles.page}>
        <div className={styles.content}>
          <SignUp />
        </div>
        <Footer />
      </main>
    </>
  );
}
