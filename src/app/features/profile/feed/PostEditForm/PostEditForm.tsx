"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/app/uikit/form/Button/Button";
import { Textarea } from "@/app/uikit/form/Textarea/Textarea";
import styles from "./PostEditForm.module.scss";

export interface PostEditFormProps {
  content: string;
  onChange: (content: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const PostEditForm = ({
  content,
  onChange,
  onCancel,
  onSave,
}: PostEditFormProps) => {
  const t = useTranslations();

  return (
    <div className={styles.editWrapper}>
      <Textarea
        appearance="secondary"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
      />
      <div className={styles.editActions}>
        <Button appearance="secondary" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button appearance="primary" onClick={onSave}>
          {t("common.save")}
        </Button>
      </div>
    </div>
  );
};
