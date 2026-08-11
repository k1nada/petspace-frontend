import styles from "./not-found.module.scss";
import Link from "next/link";
import { Button } from "../uikit/form/Button/Button";
import { Header } from "../components/Header/Header";
import { ROUTES } from "../../routes/routes";
import { useTranslations } from "next-intl";
import notFoundBg from "@/public/notFound.svg";
import Image from "next/image";

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <main className={styles.container}>
          <h2 className={styles.title}>404</h2>
          <p className={styles.text}>{t("notFound.text")}</p>
          <p className={styles.description}>{t("notFound.description")}</p>
          <Link href={ROUTES.feed}>
            <Button appearance="primary">{t("notFound.goBack")}</Button>
          </Link>
        </main>
        <Image
          src={notFoundBg}
          alt=""
          width={700}
          height={700}
          className={styles.background}
          priority
        />
      </main>
    </div>
  );
}
