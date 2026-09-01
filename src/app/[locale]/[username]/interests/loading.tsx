import styles from "@/app/features/profile/info/ProfileInterestsLayout/ProfileInterestsLayout.module.scss";
import { HeaderSkeleton } from "@/app/components/Header/HeaderSkeleton";
import { SidebarSkeleton } from "@/app/components/Sidebar/SidebarSkeleton";
import { ProfileInterestsSkeleton } from "@/app/features/profile/info/ProfileInterests/ProfileInterestsSkeleton";
import { ProfileInformationSkeleton } from "@/app/features/profile/info/ProfileInformation/ProfileInformationSkeleton";

const InterestsLoading = () => (
  <>
    <HeaderSkeleton />
    <main>
      <div className={styles.wrapper}>
        <div className={styles.sidebar}>
          <SidebarSkeleton />
        </div>
        <div className={styles.content}>
          <ProfileInterestsSkeleton />
        </div>
        <div className={styles.information}>
          <ProfileInformationSkeleton />
        </div>
      </div>
    </main>
  </>
);

export default InterestsLoading;
