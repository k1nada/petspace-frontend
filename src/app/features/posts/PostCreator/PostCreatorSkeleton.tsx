import { useTranslations } from "next-intl";
import { Skeleton } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { SKELETON_AVATAR } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import { Button } from "@/app/uikit/form/Button/Button";
import { Textarea } from "@/app/uikit/form/Textarea/Textarea";
import { Card } from "@/app/uikit/layout/Card/Card";
import styles from "./PostCreator.module.scss";

export const PostCreatorSkeleton = () => {
  const t = useTranslations();

  return (
    <Card>
      <div className={styles.wrapper}>
        <Skeleton
          shape="circle"
          width={SKELETON_AVATAR.regular}
          height={SKELETON_AVATAR.regular}
        />
        <div className={styles.textareaWrapper}>
          <Skeleton shape="rounded" width="100%">
            <Textarea appearance="secondary" readOnly />
          </Skeleton>
        </div>
        <Skeleton shape="rounded">
          <Button appearance="primary" className={styles.publishButton}>
            {t("postCreator.publish")}
          </Button>
        </Skeleton>
      </div>
    </Card>
  );
};
