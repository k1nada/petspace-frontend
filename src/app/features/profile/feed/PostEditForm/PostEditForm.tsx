"use client";

import { KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/app/uikit/form/Button/Button";
import { Textarea } from "@/app/uikit/form/Textarea/Textarea";
import { MAX_POST_LENGTH } from "@/utils/post";
import styles from "./PostEditForm.module.scss";

interface PostEditFormProps {
  content: string;
  originalContent: string;
  isSaving: boolean;
  onChange: (content: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

const COUNTER_THRESHOLD = 0.1;

export const PostEditForm = ({
  content,
  originalContent,
  isSaving,
  onChange,
  onCancel,
  onSave,
}: PostEditFormProps) => {
  const t = useTranslations();
  const trimmedContent = content.trim();
  const canSave =
    !isSaving &&
    trimmedContent !== "" &&
    trimmedContent !== originalContent.trim();
  const showCounter =
    MAX_POST_LENGTH - content.length < MAX_POST_LENGTH * COUNTER_THRESHOLD;

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
      return;
    }
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (canSave) onSave();
    }
  };

  return (
    <div className={styles.editWrapper}>
      <Textarea
        className={styles.textarea}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={(e) =>
          e.target.setSelectionRange(content.length, content.length)
        }
        autoFocus
        maxLength={MAX_POST_LENGTH}
      />
      <div className={styles.editActions}>
        {showCounter && (
          <span className={styles.counter}>
            {content.length} / {MAX_POST_LENGTH}
          </span>
        )}
        <Button appearance="secondary" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button appearance="primary" onClick={onSave} disabled={!canSave}>
          {t("common.save")}
        </Button>
      </div>
    </div>
  );
};
