"use client";

import styles from "./UserSearchDropdown.module.scss";
import cn from "classnames";
import { useTranslations } from "next-intl";
import { User as UserType } from "@/types/index";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { Skeleton, SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";

const AVATAR_SIZE = 40;
const SKELETON_ROWS = [1, 2];

interface UserSearchDropdownProps {
  results: UserType[];
  isLoading: boolean;
  isEmpty: boolean;
  onSelect: (username: string) => void;
  fullWidth?: boolean;
}

export const UserSearchDropdown = ({
  results,
  isLoading,
  isEmpty,
  onSelect,
  fullWidth,
}: UserSearchDropdownProps) => {
  const t = useTranslations();

  return (
    <ul className={cn(styles.dropdown, { [styles.fullWidth]: fullWidth })}>
      {isLoading &&
        SKELETON_ROWS.map((row) => (
          <li key={row} className={styles.skeletonItem}>
            <Skeleton shape="circle" width={AVATAR_SIZE} height={AVATAR_SIZE} />
            <SkeletonText width="60%" />
          </li>
        ))}

      {isEmpty && <li className={styles.empty}>{t("searchBar.noResults")}</li>}

      {results.map((user) => (
        <li
          key={user.id}
          className={styles.dropdownItem}
          onClick={() => onSelect(user.username)}
        >
          <Avatar src={user.avatar} size={AVATAR_SIZE} />
          <div className={styles.info}>
            <span className={styles.name}>
              {user.name || `@${user.username}`}
            </span>
            {user.name && (
              <span className={styles.username}>@{user.username}</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};
