"use client";

import styles from "./HeaderMobileSearch.module.scss";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "../../uikit/form/Button/Button";
import { SearchBar } from "../../uikit/navigation/SearchBar/SearchBar";
import { UserSearchDropdown } from "@/app/uikit/navigation/UserSearchDropdown/UserSearchDropdown";
import { User as UserType } from "@/types/index";

interface HeaderMobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onSearch: (value: string) => void;
  results: UserType[];
  onSelect: (username: string) => void;
}

export const HeaderMobileSearch = ({
  isOpen,
  onClose,
  query,
  onSearch,
  results,
  onSelect,
}: HeaderMobileSearchProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <Button appearance="ghost" className={styles.back} onClick={onClose}>
        <FaArrowLeft size={18} />
      </Button>
      <div className={styles.input}>
        <SearchBar value={query} onChange={onSearch} fullWidth autoFocus />
        <UserSearchDropdown results={results} onSelect={onSelect} fullWidth />
      </div>
    </div>
  );
};
