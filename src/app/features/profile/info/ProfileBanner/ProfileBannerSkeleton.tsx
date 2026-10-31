import { FaTrophy } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { Skeleton, SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { SKELETON_AVATAR } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import { Button } from "@/app/uikit/form/Button/Button";
import { Card } from "@/app/uikit/layout/Card/Card";
import { AvatarEditSkeleton } from "../AvatarEdit/AvatarEditSkeleton";
import styles from "./ProfileBanner.module.scss";

export const ProfileBannerSkeleton = () => {
  const t = useTranslations();

  const statLabels = [
    t("profileBanner.friendsCount", { count: 0 }),
    t("profileBanner.photosCount", { count: 0 }),
    t("common.familyTree"),
  ];

  return (
    <Card>
      <div className={styles.banner}>
        <div className={styles.avatarWrapper}>
          <AvatarEditSkeleton size={SKELETON_AVATAR.banner} />
        </div>
        <div className={styles.container}>
          <div className={styles.info}>
            <div className={styles.nameWrapper}>
              <div className={styles.name}>
                <SkeletonText width={180} />
              </div>
              <div className={styles.username}>
                <SkeletonText width={90} />
              </div>
            </div>
            <div className={styles.details}>
              <div className={styles.moreInfo}>
                <SkeletonText>{t("profileBanner.info")}</SkeletonText>
              </div>
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.stats}>
            {statLabels.map((label) => (
              <div key={label} className={styles.stat}>
                <span className={styles.statSkeleton}>
                  <SkeletonText>
                    <span className={styles.statIconSkeleton} />
                    {label}
                  </SkeletonText>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.actions}>
          <Skeleton shape="rounded">
            <Button appearance="secondary">
              <FaTrophy size={16} />
            </Button>
          </Skeleton>
          <Skeleton shape="rounded">
            <Button appearance="primary">{t("common.editProfile")}</Button>
          </Skeleton>
        </div>
      </div>
    </Card>
  );
};
