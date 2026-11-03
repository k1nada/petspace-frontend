import { useTranslations } from "next-intl";
import { SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { SKELETON_AVATAR } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import { Card } from "@/app/uikit/layout/Card/Card";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
import { AvatarSkeleton } from "@/app/uikit/user/Avatar/AvatarSkeleton";
import styles from "./SuggestionsStrip.module.scss";

const SUGGESTIONS_COUNT = 3;

export const SuggestionsStripSkeleton = () => {
  const t = useTranslations();

  return (
    <Card as="section">
      <div className={styles.header}>
        <CardTitle>
          <SkeletonText>{t("suggestedFriends.title")}</SkeletonText>
        </CardTitle>
      </div>
      <ul className={styles.list}>
        {Array.from({ length: SUGGESTIONS_COUNT }, (_, i) => (
          <li key={i} className={styles.item}>
            <AvatarSkeleton size={SKELETON_AVATAR.suggestionsStrip} />
            <span className={styles.name}>
              <SkeletonText width={48} />
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
};
