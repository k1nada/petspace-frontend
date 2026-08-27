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

  const reset = () => {
    setMode("search");
    search("");
    setForm(emptyForm);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const selectUser = async (user: User) => {
    try {
      await onAdd({
        name: user.name,
        avatar: user.avatar,
        breed: user.breed,
        username: user.username,
      });
      reset();
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const submitManual = async () => {
    try {
      await onAdd({
        name: form.name.trim(),
        breed: form.breed.trim() || undefined,
        avatar: form.avatar.trim() || undefined,
      });
      reset();
    } catch {
      toast.error(t("toasts.error"));
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

  const showNoResults = query.trim() && results.length === 0;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <Button
            key={tab}
            appearance={mode === tab ? "secondary" : "tertiary"}
            onClick={() => setMode(tab)}
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
          />

          {results.length > 0 && (
            <ul className={styles.results}>
              {results.map((user) => (
                <li
                  key={user.username}
                  className={styles.resultItem}
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
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t("familyTree.breedLabel")}</label>
            <Combobox
              value={form.breed}
              onChange={(breed) => setForm({ ...form, breed })}
              options={breeds}
              placeholder={t("placeholder.noneSelected")}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              {t("familyTree.avatarLabel")}
            </label>
            <div className={styles.avatarField}>
              <Input
                appearance="wide"
                value={form.avatar}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                placeholder={t("familyTree.avatarPlaceholder")}
              />
              <Button appearance="tertiary" onClick={generatePhoto}>
                {t("familyTree.generatePhoto")}
              </Button>
            </div>
          </div>

          <div className={styles.actions}>
            <Button appearance="secondary" onClick={handleClose}>
              {t("common.cancel")}
            </Button>
            <Button
              appearance="primary"
              onClick={submitManual}
              disabled={!form.name.trim()}
            >
              {t("familyTree.add")}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
