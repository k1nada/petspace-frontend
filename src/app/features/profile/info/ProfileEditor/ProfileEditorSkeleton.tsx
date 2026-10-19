import { useTranslations } from "next-intl";
import { Skeleton, SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { SKELETON_AVATAR } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import { Button } from "@/app/uikit/form/Button/Button";
import { Input } from "@/app/uikit/form/Input/Input";
import { Textarea } from "@/app/uikit/form/Textarea/Textarea";
import { ErrorMessage } from "@/app/uikit/form/ErrorMessage/ErrorMessage";
import { AvatarEditSkeleton } from "../AvatarEdit/AvatarEditSkeleton";
import styles from "./ProfileEditor.module.scss";

export const ProfileEditorSkeleton = () => {
  const t = useTranslations();
  const fieldLabels = [
    t("profileEditor.name"),
    t("fields.birthday"),
    t("fields.sex"),
    t("fields.country"),
    t("fields.city"),
    t("fields.breed"),
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <SkeletonText>{t("common.editProfile")}</SkeletonText>
      </h1>
      <div className={styles.profileContent}>
        <div className={styles.avatarSection}>
          <AvatarEditSkeleton size={SKELETON_AVATAR.editor} />
        </div>
        <div className={styles.userInfo}>
          <h2 className={styles.name}>
            <SkeletonText width={140} />
          </h2>
          <div className={styles.username}>
            <SkeletonText width={120} />
          </div>
        </div>
      </div>

      <div className={styles.fields}>
        {fieldLabels.map((label, i) => (
          <div key={label} className={styles.field}>
            <label className={styles.label}>
              <SkeletonText>{label}</SkeletonText>
            </label>
            <Skeleton shape="rounded" width="100%">
              <Input appearance="wide" readOnly />
            </Skeleton>
            {i === 0 && <ErrorMessage />}
          </div>
        ))}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          <SkeletonText>{t("profileEditor.bio")}</SkeletonText>
        </label>
        <Skeleton shape="rounded" width="100%">
          <Textarea appearance="third" readOnly />
        </Skeleton>
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
