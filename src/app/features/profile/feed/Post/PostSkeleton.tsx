import { Skeleton, SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { SKELETON_AVATAR } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import { LikeButton } from "@/app/uikit/feedback/LikeButton/LikeButton";
import { CommentButton } from "@/app/uikit/feedback/CommentButton/CommentButton";
import { RepostButton } from "@/app/uikit/feedback/RepostButton/RepostButton";
import headerStyles from "../PostHeader/PostHeader.module.scss";
import statsStyles from "../PostStats/PostStats.module.scss";
import styles from "./Post.module.scss";

const noop = () => {};

export const PostSkeleton = () => (
  <article>
    <div className={headerStyles.wrapper}>
      <Skeleton
        shape="circle"
        width={SKELETON_AVATAR.regular}
        height={SKELETON_AVATAR.regular}
      />
      <div className={headerStyles.info}>
        <div className={headerStyles.name}>
          <SkeletonText width={120} />
        </div>
        <div className={headerStyles.time}>
          <SkeletonText width={80} />
        </div>
      </div>
    </div>
    <div className={styles.contentWrapper}>
      <div className={styles.content}>
        <SkeletonText width="85%" />
      </div>
    </div>
    <div className={statsStyles.stats}>
      <Skeleton>
        <LikeButton
          liked={false}
          count={null}
          onToggle={noop}
          className={statsStyles.stat}
        />
      </Skeleton>
      <Skeleton>
        <CommentButton count={0} onClick={noop} className={statsStyles.stat} />
      </Skeleton>
      <Skeleton>
        <RepostButton
          reposted={false}
          count={0}
          onToggle={noop}
          className={statsStyles.stat}
        />
      </Skeleton>
    </div>
  </article>
);
