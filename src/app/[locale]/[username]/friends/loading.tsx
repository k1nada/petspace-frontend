import { HeaderSkeleton } from "@/app/components/Header/HeaderSkeleton";
import { SidebarSkeleton } from "@/app/components/Sidebar/SidebarSkeleton";
import { FriendsSkeleton } from "@/app/features/friends/Friends/FriendsSkeleton";
import { SuggestedFriendsSkeleton } from "@/app/features/feed/SuggestedFriends/SuggestedFriendsSkeleton";
import { TipSkeleton } from "@/app/uikit/feedback/Tip/TipSkeleton";
import styles from "@/app/features/friends/FriendsLayout/FriendsLayout.module.scss";

const FriendsLoading = () => (
  <>
    <HeaderSkeleton />
    <main>
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <SidebarSkeleton />
        </div>
        <div className={styles.content}>
          <FriendsSkeleton />
        </div>
        <div className={styles.rightColumn}>
          <SuggestedFriendsSkeleton />
          <TipSkeleton />
        </div>
      </div>
    </main>
  </>
);

export default FriendsLoading;
