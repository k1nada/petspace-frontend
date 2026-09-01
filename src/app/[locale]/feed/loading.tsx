import styles from "@/app/features/feed/FeedLayout/FeedLayout.module.scss";
import { HeaderSkeleton } from "@/app/components/Header/HeaderSkeleton";
import { SidebarSkeleton } from "@/app/components/Sidebar/SidebarSkeleton";
import { PostwallSkeleton } from "@/app/features/profile/feed/Postwall/PostwallSkeleton";
import { SuggestedFriendsSkeleton } from "@/app/features/feed/SuggestedFriends/SuggestedFriendsSkeleton";
import { TipSkeleton } from "@/app/uikit/feedback/Tip/TipSkeleton";

const FeedLoading = () => (
  <>
    <HeaderSkeleton />
    <main>
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <SidebarSkeleton />
        </div>
        <div className={styles.content}>
          <PostwallSkeleton />
        </div>
        <div className={styles.rightColumn}>
          <SuggestedFriendsSkeleton />
          <TipSkeleton />
        </div>
      </div>
    </main>
  </>
);

export default FeedLoading;
