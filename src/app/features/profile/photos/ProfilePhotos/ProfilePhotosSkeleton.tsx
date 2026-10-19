import { useTranslations } from "next-intl";
import { Skeleton, SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { Card } from "@/app/uikit/layout/Card/Card";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
import styles from "./ProfilePhotos.module.scss";

const SKELETON_PHOTOS_COUNT = 3;

export const ProfilePhotosSkeleton = () => {
  const t = useTranslations();

  return (
    <Card as="section">
      <div className={styles.titleLink}>
        <CardTitle>
          <SkeletonText>{t("common.photos")}</SkeletonText>
        </CardTitle>
      </div>
      <ul className={styles.gallery}>
        {Array.from({ length: SKELETON_PHOTOS_COUNT }, (_, i) => (
          <li key={i} className={styles.photo}>
            <Skeleton width="100%" height="100%" />
          </li>
        ))}
      </ul>
    </Card>
  );
};
