"use client";

import styles from "./page.module.scss";
import SignIn from "@/app/features/auth/SignIn/SignIn";
import { Footer } from "@/app/components/Footer/Footer";

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
