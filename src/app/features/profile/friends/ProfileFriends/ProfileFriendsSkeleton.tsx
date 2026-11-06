import { useTranslations } from "next-intl";
import { SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { SKELETON_AVATAR } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import { Card } from "@/app/uikit/layout/Card/Card";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
import { AvatarSkeleton } from "@/app/uikit/user/Avatar/AvatarSkeleton";
import styles from "./ProfileFriends.module.scss";

const NAME_WIDTHS = [60, 45, 55, 50, 65, 40, 55, 50];

export const ProfileFriendsSkeleton = () => {
  const t = useTranslations();

  return (
    <Card as="section">
      <div className={styles.titleLink}>
        <CardTitle>
          <SkeletonText>{t("common.friends")}</SkeletonText>
        </CardTitle>
      </div>
      <ul className={styles.friends}>
        {NAME_WIDTHS.map((width, i) => (
          <li key={i}>
            <div className={styles.friend}>
              <AvatarSkeleton
                size={SKELETON_AVATAR.friend}
                mobileSize={SKELETON_AVATAR.friendMobile}
              />
              <div className={styles.name}>
                <SkeletonText width={width} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};
