"use client";

import { SignUp } from "@/app/features/auth/SignUp/SignUp";
import styles from "./page.module.scss";

export default function SignUpPage() {
  return (
    <main className={styles.page}>
      <SignUp />
    </main>
  );
}