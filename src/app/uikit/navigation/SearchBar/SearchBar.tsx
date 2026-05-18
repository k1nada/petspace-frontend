"use client";

import { FaSearch } from "react-icons/fa";
import styles from "./SearchBar.module.scss";
import { useTranslations } from "next-intl";
import { Input } from "../../form/Input/Input";

interface SearchBarProps {
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const SearchBar = ({ placeholder, onChange }: SearchBarProps) => {
  const t = useTranslations();

  return (
    <search className={styles.wrapper} role="search">
      <FaSearch className={styles.icon} />
      <Input
        type="search"
        placeholder={placeholder ?? t("searchBar.search")}
        appearance="search"
        onChange={(e) => onChange?.(e.target.value)}
      />
    </search>
  );
};