"use client";

import styles from "./SearchBar.module.scss";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { Input } from "../../form/Input/Input";
import { useState } from "react";
import { Button } from "../../form/Button/Button";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  fullWidth?: boolean;
}

export const SearchBar = ({
  placeholder,
  value: valueProp,
  onChange,
  className,
  fullWidth,
}: SearchBarProps) => {
  const t = useTranslations();
  const [valueState, setValueState] = useState("");
  const value = valueProp ?? valueState;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueState(e.target.value);
    onChange?.(e.target.value);
  };

  const handleClear = () => {
    setValueState("");
    onChange?.("");
  };

  return (
    <search
      className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ""} ${className ?? ""}`}
    >
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
