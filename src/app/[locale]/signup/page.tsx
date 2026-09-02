import styles from "./page.module.scss";
import { SignUp } from "@/app/features/auth/SignUp/SignUp";
import { Footer } from "@/app/components/Footer/Footer";

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
