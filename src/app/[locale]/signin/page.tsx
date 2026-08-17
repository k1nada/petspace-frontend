"use client";

import SignIn from "@/app/features/auth/SignIn/SignIn";
import styles from "./page.module.scss";

export default function SignInPage() {
  return (
    <main className={styles.page}>
      <SignIn />
    </main>
  );
}
