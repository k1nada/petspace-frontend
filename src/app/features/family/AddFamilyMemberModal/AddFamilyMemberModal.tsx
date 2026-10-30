"use client";

import styles from "./AddFamilyMemberModal.module.scss";
import cn from "classnames";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
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

type Mode = "search" | "manual";
const emptyForm = { name: "", breed: "" };

interface AddFamilyMemberModalProps {
  isOpen: boolean;
  relation: FamilyRelation;
  breeds: string[];
  onClose: () => void;
  onAdd: (member: NewFamilyMember) => Promise<void>;
}

export const AddFamilyMemberModal = ({
  isOpen,
  relation,
  breeds,
  onClose,
  onAdd,
}: AddFamilyMemberModalProps) => {
  const t = useTranslations();
  const [mode, setMode] = useState<Mode>("manual");
  const { query, results, isEmpty, search } = useSearch();
  const [form, setForm] = useState(emptyForm);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => {
    setMode("manual");
    search("");
    setForm(emptyForm);
    setAvatarFile(null);
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
        name: user.name || user.username,
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

  const isSearchMode = mode === "search";

  const switchMode = () => {
    if (isSearchMode) {
      setMode("manual");
      return;
    }
    setAvatarFile(null);
    setMode("search");
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className={styles.modal}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.switchText}>
        {isSearchMode
          ? t("familyTree.notOnPetspace")
          : t("familyTree.alreadyOnPetspace")}{" "}
        <Button
          appearance="minimal"
          className={styles.switchButton}
          onClick={switchMode}
          disabled={isSubmitting}
        >
          {isSearchMode
            ? t("familyTree.addManually")
            : t("familyTree.findProfile")}
        </Button>
      </p>

      {isSearchMode ? (
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
                    <span className={styles.resultName}>
                      {user.name || user.username}
                    </span>
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
          <div className={styles.photo}>
            <AvatarUploadModal
              size={64}
              onChange={setAvatarFile}
              disabled={isSubmitting}
            />
            <Button
              appearance="secondary"
              onClick={generatePhoto}
              disabled={isSubmitting}
            >
              {t("familyTree.generatePhoto")}
            </Button>
          </div>

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
