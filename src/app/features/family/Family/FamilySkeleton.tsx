import { useTranslations } from "next-intl";
import { Skeleton, SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { SKELETON_AVATAR } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import { Card } from "@/app/uikit/layout/Card/Card";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
import styles from "./Family.module.scss";
import { FamilyColumnSkeleton } from "@/app/features/family/FamilyColumn/FamilyColumnSkeleton";
import { FamilyGridSkeleton } from "@/app/features/family/FamilyGrid/FamilyGridSkeleton";

export const FamilySkeleton = () => {
  const t = useTranslations();

  return (
    <>
      <Card as="section" className={styles.desktopTree}>
        <CardTitle as="h1">
          <SkeletonText>{t("common.familyTree")}</SkeletonText>
        </CardTitle>
        <div className={styles.content}>
          <div className={styles.parentsColumn}>
            <FamilyColumnSkeleton
              title={t("familyTree.parents")}
              addLabel={t("familyTree.addParent")}
            />
          </div>
          <div className={styles.divider} />
          <div className={styles.user}>
            <Skeleton
              shape="circle"
              width={SKELETON_AVATAR.familyUser}
              height={SKELETON_AVATAR.familyUser}
            />
            <span className={styles.name}>
              <SkeletonText width={120} />
            </span>
            <span className={styles.breed}>
              <SkeletonText width={80} />
            </span>
          </div>
          <div className={styles.divider} />
          <div className={styles.childrenColumn}>
            <FamilyColumnSkeleton
              title={t("familyTree.children")}
              addLabel={t("familyTree.addPuppy")}
            />
          </div>
        </div>
      </Card>

      <div className={styles.mobileTree}>
        <Card as="section" className={styles.dogCard}>
          <div className={styles.dog}>
            <span className={styles.dogAvatar}>
              <Skeleton
                shape="circle"
                width={SKELETON_AVATAR.familyUserMobile}
                height={SKELETON_AVATAR.familyUserMobile}
              />
            </span>
            <span className={styles.dogName}>
              <SkeletonText width={110} />
            </span>
          </div>
          <span className={styles.dogCaption}>{t("common.familyTree")}</span>
        </Card>

        <Card as="section">
          <FamilyGridSkeleton title={t("familyTree.parents")} />
          <FamilyGridSkeleton title={t("familyTree.children")} />
        </Card>
      </div>
    </>
  );
};
