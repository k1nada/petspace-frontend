"use client";

import cn from "classnames";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { Dropdown } from "@/app/uikit/overlays/Dropdown/Dropdown";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaReply } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/routes/routes";
import { formatDate } from "@/utils/dateFormatters";
import styles from "./PostHeader.module.scss";

const COMPACT_AVATAR_SIZE = 32;

interface PostHeaderProps {
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  date: string;
  locale: string;
  size?: "regular" | "compact";
  deleteLabel?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const PostHeader = ({
  author,
  date,
  locale,
  size = "regular",
  deleteLabel,
  onEdit,
  onDelete,
}: PostHeaderProps) => {
  const t = useTranslations();
  const isCompact = size === "compact";

  const menuItems = [];
  if (onEdit) {
    menuItems.push({
      label: t("common.edit"),
      icon: <MdEdit size={20} />,
      onClick: onEdit,
    });
  }
  if (onDelete) {
    menuItems.push({
      label: deleteLabel ?? t("common.delete"),
      icon: <MdDelete size={20} />,
      onClick: onDelete,
    });
  }

  return (
    <div className={cn(styles.wrapper, { [styles.compact]: isCompact })}>
      <Link
        href={ROUTES.profile(author.username)}
        className={styles.avatarLink}
      >
        <Avatar
          src={author.avatar}
          size={isCompact ? COMPACT_AVATAR_SIZE : undefined}
        />
        {isCompact && (
          <span className={styles.repostBadge}>
            <FaReply size={8} />
          </span>
        )}
      </Link>
      <div className={styles.info}>
        <Link href={ROUTES.profile(author.username)}>
          <div className={styles.name}>{author.name || author.username}</div>
        </Link>
        <time className={styles.time}>{formatDate(date, locale)}</time>
      </div>
      {menuItems.length > 0 && (
        <div className={styles.dropdown}>
          <Dropdown items={menuItems} />
        </div>
      )}
    </div>
  );
};
