import { LikeButton } from "@/app/uikit/feedback/LikeButton/LikeButton";
import { CommentButton } from "@/app/uikit/feedback/CommentButton/CommentButton";
import { RepostButton } from "@/app/uikit/feedback/RepostButton/RepostButton";
import styles from "./PostStats.module.scss";

export interface PostStatsProps {
  liked: boolean;
  likeCount: number | null;
  likeLoading: boolean;
  onToggleLike: () => void;
  commentCount: number;
  onToggleComments: () => void;
  reposted: boolean;
  repostCount: number;
  onOpenShare: () => void;
}

export const PostStats = ({
  liked,
  likeCount,
  likeLoading,
  onToggleLike,
  commentCount,
  onToggleComments,
  reposted,
  repostCount,
  onOpenShare,
}: PostStatsProps) => {
  return (
    <div className={styles.stats}>
      <LikeButton
        liked={liked}
        count={likeCount}
        loading={likeLoading}
        onToggle={onToggleLike}
        className={styles.stat}
      />
      <CommentButton
        count={commentCount}
        onClick={onToggleComments}
        className={styles.stat}
      />
      <RepostButton
        reposted={reposted}
        count={repostCount}
        onToggle={onOpenShare}
        className={styles.stat}
      />
    </div>
  );
};
