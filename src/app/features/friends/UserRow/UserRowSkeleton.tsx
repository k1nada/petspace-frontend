import { useTranslations } from "next-intl";
import { Skeleton, SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { SKELETON_AVATAR } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import { Button } from "@/app/uikit/form/Button/Button";
import { IconButtonSkeleton } from "@/app/uikit/form/IconButton/IconButtonSkeleton";
import { AvatarSkeleton } from "@/app/uikit/user/Avatar/AvatarSkeleton";
import styles from "./UserRow.module.scss";

interface UserRowSkeletonProps {
  nameWidth: string;
}

export const UserRowSkeleton = ({ nameWidth }: UserRowSkeletonProps) => {
  const t = useTranslations();

  return (
    <li className={styles.row}>
      <AvatarSkeleton
        size={SKELETON_AVATAR.friendRow}
        mobileSize={SKELETON_AVATAR.friendRowMobile}
      />

      <div className={styles.info}>
        <span className={styles.name}>
          <SkeletonText width={nameWidth} />
        </span>
        <span className={styles.status}>
          <SkeletonText width="30%" />
        </span>
      </div>

      <div className={styles.actions}>
        <Skeleton shape="rounded" className={styles.messageButton}>
          <Button appearance="primary">{t("friends.message")}</Button>
        </Skeleton>
        <div className={styles.messageIcon}>
          <IconButtonSkeleton />
        </div>
        <IconButtonSkeleton />
      </div>
    </li>
  );
};
