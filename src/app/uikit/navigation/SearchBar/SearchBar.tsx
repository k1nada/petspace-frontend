"use client";

import { FaSearch, FaTimes } from "react-icons/fa";
import styles from "./SearchBar.module.scss";
import { useTranslations } from "next-intl";
import { Input } from "../../form/Input/Input";
import { useState } from "react";
import { Button } from "../../form/Button/Button";

interface SearchBarProps {
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const SearchBar = ({ placeholder, onChange }: SearchBarProps) => {
  const t = useTranslations();
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange?.(e.target.value);
  };

  const handleClear = () => {
    setValue("");
    onChange?.("");
  };

  return (
    <search className={styles.wrapper}>
      <FaSearch className={styles.icon} />
      <Input
        type="search"
        placeholder={placeholder ?? t("searchBar.search")}
        appearance="search"
        value={value}
        onChange={handleChange}
      />
      {value && (
        <Button
          appearance="ghost"
          className={styles.delete}
          onClick={handleClear}
        >
          <FaTimes />
        </Button>
      )}
    </search>
  );
};