import { ReactNode } from "react";
import { Header } from "@/app/components/Header/Header";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { PageTransition } from "@/app/components/PageTransition/PageTransition";
import styles from "./layout.module.scss";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Header />
      <main>
        <div className={styles.layout}>
          <div className={styles.sidebar}>
            <Sidebar />
          </div>
          <div className={styles.content}>
            <PageTransition>{children}</PageTransition>
          </div>
        </div>
      </main>
    </>
  );
};

export default MainLayout;
