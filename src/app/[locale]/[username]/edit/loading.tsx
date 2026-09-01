import styles from "@/app/features/profile/info/ProfileEditorLayout/ProfileEditorLayout.module.scss";
import { HeaderSkeleton } from "@/app/components/Header/HeaderSkeleton";
import { SidebarSkeleton } from "@/app/components/Sidebar/SidebarSkeleton";
import { ProfileEditorSkeleton } from "@/app/features/profile/info/ProfileEditor/ProfileEditorSkeleton";
import { ProfileInformationSkeleton } from "@/app/features/profile/info/ProfileInformation/ProfileInformationSkeleton";

const EditLoading = () => (
  <>
    <HeaderSkeleton />
    <main>
      <div className={styles.wrapper}>
        <div className={styles.sidebar}>
          <SidebarSkeleton />
        </div>
        <div className={styles.content}>
          <ProfileEditorSkeleton />
        </div>
        <div className={styles.information}>
          <ProfileInformationSkeleton />
        </div>
      </div>
    </main>
  </>
);

export default EditLoading;
