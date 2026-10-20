import { useTranslations } from "next-intl";
import { Skeleton, SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { SKELETON_AVATAR } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import { Button } from "@/app/uikit/form/Button/Button";
import { IconButtonSkeleton } from "@/app/uikit/form/IconButton/IconButtonSkeleton";
import styles from "./UserRow.module.scss";

interface UserRowSkeletonProps {
  nameWidth: string;
}

export const UserRowSkeleton = ({ nameWidth }: UserRowSkeletonProps) => {
  const t = useTranslations();

  return (
    <li className={styles.row}>
      <Skeleton
        shape="circle"
        width={SKELETON_AVATAR.friendRow}
        height={SKELETON_AVATAR.friendRow}
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
        <Skeleton shape="rounded">
          <Button appearance="primary">{t("friends.message")}</Button>
        </Skeleton>
        <IconButtonSkeleton />
      </div>
    </li>
  );
};
