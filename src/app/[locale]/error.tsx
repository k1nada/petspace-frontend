"use client";

import styles from "./error.module.scss";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/app/uikit/form/Button/Button";
import { Header } from "@/app/components/Header/Header";
import { ROUTES } from "@/routes/routes";
import { useTranslations } from "next-intl";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <div className={styles.container}>
          <h2 className={styles.title}>500</h2>
          <p className={styles.text}>{t("serverError.text")}</p>
          <p className={styles.description}>{t("serverError.description")}</p>
          <div className={styles.actions}>
            <Button appearance="tertiary" onClick={reset}>
              {t("serverError.tryAgain")}
            </Button>
            <Button
              appearance="primary"
              onClick={() => router.push(ROUTES.feed)}
            >
              {t("serverError.goBack")}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
