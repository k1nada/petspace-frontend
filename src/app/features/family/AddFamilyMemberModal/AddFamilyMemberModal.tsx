"use client";

import styles from "./AddFamilyMemberModal.module.scss";
import Image from "next/image";
import cn from "classnames";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { MdAdd } from "react-icons/md";
import { Modal } from "@/app/uikit/overlays/Modal/Modal";
import { SearchBar } from "@/app/uikit/navigation/SearchBar/SearchBar";
import { Input } from "@/app/uikit/form/Input/Input";
import { Combobox } from "@/app/uikit/form/Combobox/Combobox";
import { Button } from "@/app/uikit/form/Button/Button";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { AvatarUploadModal } from "@/app/uikit/user/AvatarUploadModal/AvatarUploadModal";
import { useSearch } from "@/app/hooks/shared/useSearch";
import { uploadFamilyAvatar } from "@/services/api/upload";
import { FamilyRelation, NewFamilyMember, User } from "@/types";
import { MAX_PUPPIES } from "@/utils/family";
import defaultAvatar from "@/assets/avatars/default.png";

type Mode = "search" | "manual";
const TABS: Mode[] = ["search", "manual"];
const emptyForm = { name: "", breed: "" };

interface AddFamilyMemberModalProps {
  isOpen: boolean;
  relation: FamilyRelation;
  breeds: string[];
  avatar?: string;
  existingMemberAvatar?: string;
  onClose: () => void;
  onAdd: (member: NewFamilyMember) => Promise<void>;
}

export const AddFamilyMemberModal = ({
  isOpen,
  relation,
  breeds,
  avatar,
  existingMemberAvatar,
  onClose,
  onAdd,
}: AddFamilyMemberModalProps) => {
  const t = useTranslations();
  const [mode, setMode] = useState<Mode>("search");
  const { query, results, isEmpty, search } = useSearch();
  const [form, setForm] = useState(emptyForm);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhotoRevealed, setIsPhotoRevealed] = useState(false);

  const reset = () => {
    setMode("search");
    search("");
    setForm(emptyForm);
    setAvatarFile(null);
    setIsPhotoRevealed(false);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    reset();
    onClose();
  };

  const showAddError = (error: unknown) => {
    if (
      isAxiosError(error) &&
      error.response?.data?.type === "PUPPIES_LIMIT_REACHED"
    ) {
      toast.error(t("familyTree.puppiesLimit", { count: MAX_PUPPIES }));
      return;
    }
    toast.error(t("familyTree.addError"));
  };

  const selectUser = async (user: User) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onAdd({
        name: user.name,
        avatar: user.avatar,
        breed: user.breed,
        username: user.username,
      });
      reset();
    } catch (error) {
      showAddError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitManual = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const avatarUrl = avatarFile
        ? await uploadFamilyAvatar(avatarFile)
        : undefined;
      await onAdd({
        name: form.name.trim(),
        breed: form.breed.trim() || undefined,
        avatar: avatarUrl,
      });
      reset();
    } catch (error) {
      showAddError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePhoto = () => {
    toast.info(t("familyTree.generatePhotoComingSoon"));
  };

  const title = t(
    relation === "parent"
      ? "familyTree.addModalTitleParent"
      : "familyTree.addModalTitleChild",
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className={styles.modal}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>
        {t("familyTree.addModalDescription")}
      </p>

      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <Button
            key={tab}
            appearance={mode === tab ? "primary" : "tertiary"}
            onClick={() => setMode(tab)}
            disabled={isSubmitting}
          >
            {t(`familyTree.${tab}Tab`)}
          </Button>
        ))}
      </div>

      {mode === "search" ? (
        <div className={styles.searchMode}>
          <SearchBar
            value={query}
            onChange={search}
            fullWidth
            placeholder={t("familyTree.searchPlaceholder")}
            disabled={isSubmitting}
          />

          {results.length > 0 && (
            <ul className={styles.results}>
              {results.map((user) => (
                <li
                  key={user.username}
                  className={cn(styles.resultItem, {
                    [styles.disabled]: isSubmitting,
                  })}
                  onClick={() => selectUser(user)}
                >
                  <Avatar src={user.avatar} size={40} />
                  <div className={styles.resultInfo}>
                    <span className={styles.resultName}>{user.name}</span>
                    <span className={styles.resultUsername}>
                      @{user.username}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {isEmpty && (
            <p className={styles.noResults}>{t("familyTree.noResults")}</p>
          )}
        </div>
      ) : (
        <div className={styles.manualMode}>
          <div className={styles.field}>
            <span className={styles.label}>{t("familyTree.nameLabel")}</span>
            <Input
              appearance="wide"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t("familyTree.namePlaceholder")}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <span className={styles.label}>{t("familyTree.breedLabel")}</span>
            <Combobox
              value={form.breed}
              onChange={(breed) => setForm({ ...form, breed })}
              options={breeds}
              placeholder={t("placeholder.noneSelected")}
              disabled={isSubmitting}
            />
          </div>

          {isPhotoRevealed ? (
            <div className={styles.field}>
              <span className={styles.label}>
                {t("familyTree.avatarLabel")}
              </span>
              <div className={styles.photoRow}>
                <AvatarUploadModal
                  size={44}
                  onChange={setAvatarFile}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className={styles.generateButton}
                  onClick={generatePhoto}
                  disabled={isSubmitting}
                >
                  <span className={styles.generateAvatars}>
                    <Image
                      src={avatar || defaultAvatar}
                      alt=""
                      width={18}
                      height={18}
                      unoptimized
                      className={styles.generateAvatarThumb}
                    />
                    <Image
                      src={existingMemberAvatar || avatar || defaultAvatar}
                      alt=""
                      width={18}
                      height={18}
                      unoptimized
                      className={cn(
                        styles.generateAvatarThumb,
                        styles.generateAvatarThumbOverlap,
                      )}
                    />
                  </span>
                  {t("familyTree.generatePhoto")}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className={styles.photoToggle}
              onClick={() => setIsPhotoRevealed(true)}
              disabled={isSubmitting}
            >
              <span>{t("familyTree.addPhotoLabel")}</span>
              <span className={styles.photoToggleAction}>
                {t("familyTree.add")}
                <MdAdd size={14} />
              </span>
            </button>
          )}

          <div className={styles.actions}>
            <Button
              appearance="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </Button>
            <Button
              appearance="primary"
              onClick={submitManual}
              disabled={!form.name.trim() || isSubmitting}
            >
              {t("familyTree.add")}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
