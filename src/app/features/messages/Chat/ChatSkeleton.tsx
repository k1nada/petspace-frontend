import cn from "classnames";
import { Skeleton, SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import {
  SKELETON_AVATAR,
  SKELETON_ICON,
} from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import { SubmitTextarea } from "@/app/uikit/form/SubmitTextarea/SubmitTextarea";
import { AvatarSkeleton } from "@/app/uikit/user/Avatar/AvatarSkeleton";
import messageStyles from "../ChatMessage/ChatMessage.module.scss";
import styles from "./Chat.module.scss";
import skeletonStyles from "./ChatSkeleton.module.scss";

const noop = () => {};

const MESSAGES = [
  { width: 180, own: false },
  { width: 120, own: true },
  { width: 240, own: false },
  { width: 160, own: true },
  { width: 100, own: false },
  { width: 200, own: true },
];

export const ChatMessagesSkeleton = () => (
  <>
    {MESSAGES.map((message, i) => (
      <li
        key={i}
        className={cn(messageStyles.message, messageStyles.groupStart, {
          [messageStyles.own]: message.own,
        })}
      >
        <div className={messageStyles.content}>
          <Skeleton shape="rounded">
            <span
              className={messageStyles.bubble}
              style={{ width: message.width }}
            >
              {"\u00a0"}
            </span>
          </Skeleton>
        </div>
      </li>
    ))}
  </>
);

export const ChatSkeleton = () => (
  <section className={styles.container}>
    <div className={styles.userInfo}>
      <div className={styles.user}>
        <div className={skeletonStyles.backButton}>
          <Skeleton
            shape="circle"
            width={SKELETON_ICON.close}
            height={SKELETON_ICON.close}
          />
        </div>
        <AvatarSkeleton
          size={SKELETON_AVATAR.regular}
          mobileSize={SKELETON_AVATAR.regularMobile}
        />
        <div className={styles.info}>
          <span className={styles.name}>
            <SkeletonText width={100} />
          </span>
          <span className={styles.status}>
            <SkeletonText width={50} />
          </span>
        </div>
      </div>
    </div>
    <ul className={styles.list}>
      <ChatMessagesSkeleton />
    </ul>
    <div className={styles.input}>
      <Skeleton shape="rounded" width="100%">
        <SubmitTextarea value="" onChange={noop} onSubmit={noop} />
      </Skeleton>
    </div>
  </section>
);
