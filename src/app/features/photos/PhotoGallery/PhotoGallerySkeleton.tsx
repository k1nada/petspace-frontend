import { useTranslations } from "next-intl";
import { Skeleton, SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { SKELETON_ICON } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import { Card } from "@/app/uikit/layout/Card/Card";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
import { DropdownSkeleton } from "@/app/uikit/overlays/Dropdown/DropdownSkeleton";
import gridStyles from "../PhotoGrid/PhotoGrid.module.scss";
import styles from "./PhotoGallery.module.scss";

const SKELETON_PHOTOS_COUNT = 24;

export const PhotoGallerySkeleton = () => {
  const t = useTranslations();

  return (
    <Card as="section">
      <div className={styles.header}>
        <CardTitle as="h1">
          <SkeletonText>{t("photoGallery.title")}</SkeletonText>
        </CardTitle>
        <div className={styles.menu}>
          <DropdownSkeleton iconSize={SKELETON_ICON.navigation} />
        </div>
      </div>

      <ul className={gridStyles.gallery}>
        {Array.from({ length: SKELETON_PHOTOS_COUNT }, (_, i) => (
          <li key={i} className={gridStyles.photo}>
            <Skeleton width="100%" height="100%" />
          </li>
        ))}
      </ul>
    </Card>
  );
};
