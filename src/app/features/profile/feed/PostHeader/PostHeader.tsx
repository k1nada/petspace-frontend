"use client";

import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { DropdownMenu } from "@/app/uikit/overlays/DropdownMenu/DropdownMenu";
import { MdDeleteSweep, MdModeEdit } from "react-icons/md";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/routes/routes";
import { formatDate } from "@/utils/dateFormatters";
import { Post as PostType } from "@/types";
import styles from "./PostHeader.module.scss";

export interface PostHeaderProps {
  post: PostType;
  locale: string;
  showActions: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const PostHeader = ({
  post,
  locale,
  showActions,
  onEdit,
  onDelete,
}: PostHeaderProps) => {
  const t = useTranslations();

  return (
    <div className={styles.wrapper}>
      <Link href={ROUTES.profile(post.user.username)}>
        <Avatar src={post.user.avatar} />
      </Link>
      <div className={styles.info}>
        <Link href={ROUTES.profile(post.user.username)}>
          <div className={styles.name}>{post.user.name}</div>
        </Link>
        <time className={styles.time}>
          {formatDate(post.createdAt, locale)}
        </time>
      </div>
      {showActions && (
        <div className={styles.dropdown}>
          <DropdownMenu
            items={[
              {
                label: t("common.edit"),
                icon: <MdModeEdit size={20} />,
                onClick: onEdit,
              },
              {
                label: t("common.delete"),
                icon: <MdDeleteSweep size={20} />,
                onClick: onDelete,
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};
