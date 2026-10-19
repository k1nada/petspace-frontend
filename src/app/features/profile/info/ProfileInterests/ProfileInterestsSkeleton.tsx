import { useTranslations } from "next-intl";
import { Skeleton, SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { Button } from "@/app/uikit/form/Button/Button";
import { Textarea } from "@/app/uikit/form/Textarea/Textarea";
import styles from "./ProfileInterests.module.scss";

export const ProfileInterestsSkeleton = () => {
  const t = useTranslations();
  const fieldLabels = [
    t("profileInterests.toys"),
    t("profileInterests.treats"),
    t("profileInterests.activities"),
    t("profileInterests.crimes"),
    t("profileInterests.habits"),
    t("profileInterests.humans"),
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <SkeletonText>{t("profileInterests.title")}</SkeletonText>
      </h1>
      <div className={styles.fields}>
        {fieldLabels.map((label) => (
          <div key={label} className={styles.field}>
            <label className={styles.label}>
              <SkeletonText>{label}</SkeletonText>
            </label>
            <Skeleton shape="rounded" width="100%">
              <Textarea appearance="primary" readOnly />
            </Skeleton>
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        <Skeleton shape="rounded">
          <Button appearance="primary">
            {t("common.save")}
          </Button>
        </Skeleton>
        <Skeleton shape="rounded">
          <Button appearance="secondary">
            {t("common.cancel")}
          </Button>
        </Skeleton>
      </div>
    </div>
  );
};
