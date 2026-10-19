import { ProfileBannerSkeleton } from "../info/ProfileBanner/ProfileBannerSkeleton";
import { PostCreatorSkeleton } from "../feed/PostCreator/PostCreatorSkeleton";
import { PostwallSkeleton } from "../feed/Postwall/PostwallSkeleton";
import { ProfilePhotosSkeleton } from "../photos/ProfilePhotos/ProfilePhotosSkeleton";
import { ProfileFriendsSkeleton } from "../friends/ProfileFriends/ProfileFriendsSkeleton";
import styles from "./ProfileLayout.module.scss";

export const ProfileLayoutSkeleton = () => (
  <div className={styles.layout}>
    <div className={styles.profileBanner}>
      <ProfileBannerSkeleton />
    </div>
    <div className={styles.feedContainer}>
      <PostCreatorSkeleton />
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
);
