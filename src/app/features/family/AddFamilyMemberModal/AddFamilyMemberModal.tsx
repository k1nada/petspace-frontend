"use client";

import styles from "./AddFamilyMemberModal.module.scss";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { Modal } from "@/app/uikit/overlays/Modal/Modal";
import { SearchBar } from "@/app/uikit/navigation/SearchBar/SearchBar";
import { Input } from "@/app/uikit/form/Input/Input";
import { Combobox } from "@/app/uikit/form/Combobox/Combobox";
import { Button } from "@/app/uikit/form/Button/Button";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { AvatarUploadModal } from "@/app/features/profile/modals/AvatarUploadModal/AvatarUploadModal";
import { useSearch } from "@/app/hooks/shared/useSearch";
import { FamilyRelation, NewFamilyMember, User } from "@/types";

type Mode = "search" | "manual";
const TABS: Mode[] = ["search", "manual"];
const emptyForm = { name: "", breed: "", avatar: "" };

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
  const [mode, setMode] = useState<Mode>("search");
  const { query, results, search } = useSearch();
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => {
    setMode("search");
    search("");
    setForm(emptyForm);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    reset();
    onClose();
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
      setIsSubmitting(false);
    } catch {
      toast.error(t("familyTree.addError"));
      setIsSubmitting(false);
    }
  };

  const submitManual = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onAdd({
        name: form.name.trim(),
        breed: form.breed.trim() || undefined,
        avatar: form.avatar.trim() || undefined,
      });
      reset();
      setIsSubmitting(false);
    } catch {
      toast.error(t("familyTree.addError"));
      setIsSubmitting(false);
    }
  };

  const generatePhoto = () => {
    toast.info(t("familyTree.generatePhotoComingSoon"));
  };

  const handleFilePicked = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setForm({ ...form, avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const title = t(
    relation === "parent"
      ? "familyTree.addModalTitleParent"
      : "familyTree.addModalTitleChild",
  );

  const showNoResults = query.trim() && results.length === 0;

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
                  className={styles.resultItem}
                  style={{ opacity: isSubmitting ? 0.6 : 1 }}
                  onClick={() => !isSubmitting && selectUser(user)}
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

          {showNoResults && (
            <p className={styles.noResults}>{t("familyTree.noResults")}</p>
          )}
        </div>
      ) : (
        <div className={styles.manualMode}>
          <div className={styles.field}>
            <label className={styles.label}>{t("familyTree.nameLabel")}</label>
            <Input
              appearance="wide"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t("familyTree.namePlaceholder")}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t("familyTree.breedLabel")}</label>
            <Combobox
              value={form.breed}
              onChange={(breed) => setForm({ ...form, breed })}
              options={breeds}
              placeholder={t("placeholder.noneSelected")}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              {t("familyTree.avatarLabel")}
            </label>
            <div className={styles.avatarField}>
              <AvatarUploadModal
                size={72}
                profileAvatar={form.avatar || undefined}
                onChange={handleFilePicked}
                disabled={isSubmitting}
              />
              <div className={styles.avatarActions}>
                <p className={styles.hint}>{t("avatarEdit.choosePhoto")}</p>
                <Button
                  appearance="tertiary"
                  onClick={generatePhoto}
                  disabled={isSubmitting}
                >
                  {t("familyTree.generatePhoto")}
                </Button>
              </div>
            </div>
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
