"use client";

import styles from "./error.module.scss";
import Link from "next/link";
import { Button } from "../uikit/form/Button/Button";
import { Header } from "../components/Header/Header";
import { ROUTES } from "../../routes/routes";
import { useTranslations } from "next-intl";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  const t = useTranslations();

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <div className={styles.container}>
          <h2 className={styles.title}>500</h2>
          <p className={styles.text}>{t("serverError.text")}</p>
          <p className={styles.description}>{t("serverError.description")}</p>
          <div className={styles.actions}>
            <Button appearance="secondary" onClick={reset}>
              {t("serverError.tryAgain")}
            </Button>
            <Link href={ROUTES.feed}>
              <Button appearance="primary">{t("serverError.goBack")}</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
