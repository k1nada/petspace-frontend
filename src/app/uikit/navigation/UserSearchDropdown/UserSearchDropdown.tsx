"use client";

import styles from "./UserSearchDropdown.module.scss";
import { User as UserType } from "@/types/index";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";

const MAX_RESULTS = 8;

interface UserSearchDropdownProps {
  results: UserType[];
  onSelect: (username: string) => void;
}

export const UserSearchDropdown = ({
  results,
  onSelect,
}: UserSearchDropdownProps) => {
  if (results.length === 0) return null;

  return (
    <ul className={styles.dropdown}>
      {results.slice(0, MAX_RESULTS).map((user) => (
        <li
          key={user.id}
          className={styles.dropdownItem}
          onClick={() => onSelect(user.username)}
        >
          <Avatar src={user.avatar} size={40} />
          <div className={styles.info}>
            <span className={styles.name}>{user.name}</span>
            <span className={styles.username}>@{user.username}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};
