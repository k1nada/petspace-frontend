import { HeaderSkeleton } from "@/app/components/Header/HeaderSkeleton";
import { SidebarSkeleton } from "@/app/components/Sidebar/SidebarSkeleton";
import { ProfileBannerSkeleton } from "@/app/features/profile/info/ProfileBanner/ProfileBannerSkeleton";
import { PostwallSkeleton } from "@/app/features/profile/feed/Postwall/PostwallSkeleton";
import { ProfilePhotosSkeleton } from "@/app/features/profile/photos/ProfilePhotos/ProfilePhotosSkeleton";
import { ProfileFriendsSkeleton } from "@/app/features/profile/friends/ProfileFriends/ProfileFriendsSkeleton";
import styles from "@/app/features/profile/ProfileLayout/ProfileLayout.module.scss";

const ProfileLoading = () => (
  <>
    <HeaderSkeleton />
    <main>
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <SidebarSkeleton />
        </div>
        <div className={styles.profileBanner}>
          <ProfileBannerSkeleton />
        </div>
        <div className={styles.feedContainer}>
          <PostwallSkeleton />
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.photos}>
            <ProfilePhotosSkeleton />
          </div>
          <div className={styles.friends}>
            <ProfileFriendsSkeleton />
          </div>
        </div>
      </div>
    </main>
  </>
);

export default ProfileLoading;
