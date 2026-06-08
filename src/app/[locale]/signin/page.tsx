"use client";

import SignIn from "@/app/features/auth/SignIn/SignIn";
import styles from "./page.module.scss";
import { Header } from "@/app/components/Header/Header";

export default function SignInPage() {
  return (
    <main className={styles.page}>
      <Header />
      <SignIn />
    </main>
  );
}
