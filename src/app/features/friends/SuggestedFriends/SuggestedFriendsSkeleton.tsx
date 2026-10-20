import { useTranslations } from "next-intl";
import { Skeleton, SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { SKELETON_AVATAR } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import { Button } from "@/app/uikit/form/Button/Button";
import { Card } from "@/app/uikit/layout/Card/Card";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
import styles from "./SuggestedFriends.module.scss";

const SUGGESTIONS_COUNT = 3;
const NAME_WIDTHS = ["60%", "75%", "50%"];

export const SuggestedFriendsSkeleton = () => {
  const t = useTranslations();

  return (
    <Card as="section">
      <CardTitle>
        <SkeletonText>{t("suggestedFriends.title")}</SkeletonText>
      </CardTitle>
      <ul className={styles.list}>
        {Array.from({ length: SUGGESTIONS_COUNT }, (_, i) => (
          <li key={i} className={styles.card}>
            <Skeleton
              shape="circle"
              width={SKELETON_AVATAR.suggested}
              height={SKELETON_AVATAR.suggested}
            />
            <div className={styles.info}>
              <div className={styles.name}>
                <SkeletonText width={NAME_WIDTHS[i]} />
              </div>
              <div className={styles.breed}>
                <SkeletonText width="40%" />
              </div>
            </div>
            <Skeleton shape="rounded">
              <Button appearance="primary" className={styles.addButton}>
                {t("suggestedFriends.add")}
              </Button>
            </Skeleton>
          </li>
        ))}
      </ul>
    </Card>
  );
};
