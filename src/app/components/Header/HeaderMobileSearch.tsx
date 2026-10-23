"use client";

import styles from "./HeaderMobileSearch.module.scss";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@/app/uikit/form/Button/Button";
import { SearchBar } from "@/app/uikit/navigation/SearchBar/SearchBar";
import { UserSearchDropdown } from "@/app/uikit/navigation/UserSearchDropdown/UserSearchDropdown";
import { User as UserType } from "@/types/index";

interface HeaderMobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onSearch: (value: string) => void;
  results: UserType[];
  isLoading: boolean;
  isEmpty: boolean;
  isDropdownOpen: boolean;
  onSelect: (username: string) => void;
}

export const HeaderMobileSearch = ({
  isOpen,
  onClose,
  query,
  onSearch,
  results,
  isLoading,
  isEmpty,
  isDropdownOpen,
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
        {isDropdownOpen && (
          <UserSearchDropdown
            results={results}
            isLoading={isLoading}
            isEmpty={isEmpty}
            onSelect={onSelect}
            fullWidth
          />
        )}
      </div>
    </div>
  );
};
