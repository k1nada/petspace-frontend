import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import styles from "./page.module.scss";
import SignIn from "@/app/features/auth/SignIn/SignIn";
import { Footer } from "@/app/components/Footer/Footer";

interface SignInPageProps {
  params: Promise<{ locale: string }>;
}

export const generateMetadata = async ({
  params,
}: SignInPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("metadata.signin.title"),
    description: t("metadata.signin.description"),
  };
};

export default function SignInPage() {
  return (
    <>
      <main className={styles.page}>
        <div className={styles.content}>
          <SignIn />
        </div>
        <Footer />
      </main>
    </>
  );
}
