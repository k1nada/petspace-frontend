import { useTranslations } from "next-intl";
import { PhotoIcon } from "@/app/uikit/brand/PhotoIcon/PhotoIcon";
import { Skeleton, SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
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
      </div>
      <div className={styles.actions}>
        <div className={styles.attachments}>
          <div className={styles.attachmentSkeleton}>
            <SkeletonText>
              <PhotoIcon size={16} />
              {t("postCreator.photo")}
            </SkeletonText>
          </div>
        </div>
        <Skeleton shape="rounded">
          <Button appearance="primary">{t("postCreator.publish")}</Button>
        </Skeleton>
      </div>
    </Card>
  );
};
