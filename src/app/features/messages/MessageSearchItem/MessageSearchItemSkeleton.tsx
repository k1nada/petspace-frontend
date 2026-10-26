import { Skeleton, SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { SKELETON_AVATAR } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import styles from "./MessageSearchItem.module.scss";

const ROWS = [
  { name: "45%", text: "80%" },
  { name: "35%", text: "65%" },
  { name: "50%", text: "75%" },
];

export const MessageSearchItemSkeleton = () => (
  <>
    {ROWS.map((row, i) => (
      <li key={i} className={styles.item}>
        <div className={styles.button}>
          <Skeleton
            shape="circle"
            width={SKELETON_AVATAR.messageSearch}
            height={SKELETON_AVATAR.messageSearch}
          />
          <div className={styles.info}>
            <span className={styles.name}>
              <SkeletonText width={row.name} />
            </span>
            <span className={styles.text}>
              <SkeletonText width={row.text} />
            </span>
          </div>
        </div>
      </li>
    ))}
  </>
);
