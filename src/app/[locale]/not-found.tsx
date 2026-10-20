"use client";

import styles from "./not-found.module.scss";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/app/uikit/form/Button/Button";
import { Header } from "@/app/components/Header/Header";
import { ROUTES } from "@/routes/routes";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <div className={styles.container}>
          <h2 className={styles.title}>404</h2>
          <p className={styles.text}>{t("notFound.text")}</p>
          <p className={styles.description}>{t("notFound.description")}</p>
          <Button appearance="primary" onClick={() => router.push(ROUTES.feed)}>
            {t("notFound.goBack")}
          </Button>
        </div>
      </main>
    </div>
  );
}
