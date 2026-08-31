import styles from "./PostCreator.module.scss";
import Image from "next/image";
import { Button } from "@/app/uikit/form/Button/Button";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { FaCamera, FaTimes } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { createPost, uploadPostPhoto } from "@/services/api/post";
import { Textarea } from "@/app/uikit/form/Textarea/Textarea";
import { useTextareaSubmit } from "@/app/hooks/shared/useTextareaSubmit";
import { toast } from "react-toastify";

interface PostCreatorProps {
  avatar?: string;
  name: string;
  postwallId: string;
  onSuccess?: () => void;
}

export const PostCreator = ({
  avatar,
  name,
  postwallId,
  onSuccess,
}: PostCreatorProps) => {
  const t = useTranslations();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  };

  const publishPost = async () => {
    const trimmedContent = content.trim();
    if (isPublishing || (!trimmedContent && !imagePreview)) return;
    setIsPublishing(true);
    try {
      const image = imageFile ? await uploadPostPhoto(imageFile) : undefined;
      const post = await createPost(trimmedContent, postwallId, image);
      if (!post) {
        toast.error(t("toasts.error"));
        return;
      }
      setContent("");
      removeImage();
      onSuccess?.();
    } catch {
      toast.error(t("toasts.error"));
    } finally {
      setIsPublishing(false);
    }
  };

  const { handleKeyDown } = useTextareaSubmit({ onSubmit: publishPost });

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Avatar src={avatar} />
        <div className={styles.textareaWrapper}>
          <Textarea
            appearance="secondary"
            value={content}
            onKeyDown={handleKeyDown}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("postCreator.placeholder") + name + "?"}
          />
        </div>
      </div>
      {imagePreview && (
        <div className={styles.imagePreviewWrapper}>
          <Image
            src={imagePreview}
            alt={t("postCreator.photo")}
            className={styles.imagePreview}
            fill
            unoptimized
          />
          <Button
            appearance="ghost"
            className={styles.removeImage}
            onClick={removeImage}
            aria-label={t("postCreator.removePhoto")}
          >
            <FaTimes size={14} />
          </Button>
        </div>
      )}
      <div className={styles.actions}>
        <div className={styles.attachments}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
          <Button
            appearance="ghost"
            className={styles.attachmentItem}
            onClick={() => fileInputRef.current?.click()}
          >
            <FaCamera size={16} />
            {t("postCreator.photo")}
          </Button>
        </div>
        <Button
          appearance="primary"
          onClick={publishPost}
        >
          {t("postCreator.publish")}
        </Button>
      </div>
    </div>
  );
};
