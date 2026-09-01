import styles from "@/app/features/family/FamilyLayout/FamilyLayout.module.scss";
import { HeaderSkeleton } from "@/app/components/Header/HeaderSkeleton";
import { SidebarSkeleton } from "@/app/components/Sidebar/SidebarSkeleton";
import { FamilySkeleton } from "@/app/features/family/Family/FamilySkeleton";
import { TipSkeleton } from "@/app/uikit/feedback/Tip/TipSkeleton";

const FamilyLoading = () => (
  <>
    <HeaderSkeleton />
    <main>
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <SidebarSkeleton />
        </div>
        <div className={styles.content}>
          <FamilySkeleton />
        </div>
        <div className={styles.rightColumn}>
          <TipSkeleton />
        </div>
      </div>
    </main>
  </>
);

export default FamilyLoading;
