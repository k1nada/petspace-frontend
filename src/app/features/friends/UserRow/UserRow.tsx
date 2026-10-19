import { ReactNode } from "react";
import cn from "classnames";
import { useLocale, useTranslations } from "next-intl";
import dayjs from "@/utils/dayjs";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { ROUTES } from "@/routes/routes";
import styles from "./UserRow.module.scss";

interface UserRowProps {
  username: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  fallbackStatus: string;
  actions?: ReactNode;
  children?: ReactNode;
}

export const UserRow = ({
  username,
  name,
  avatar,
  isOnline,
  lastSeen,
  fallbackStatus,
  actions,
  children,
}: UserRowProps) => {
  const t = useTranslations();
  const locale = useLocale();

  let status = fallbackStatus;
  if (lastSeen) {
    status = t("friends.lastSeen", {
      time: dayjs(lastSeen).locale(locale).fromNow(),
    });
  }
  if (isOnline) status = t("common.online");

  return (
    <li className={styles.row}>
      <Link href={ROUTES.profile(username)} className={styles.avatarLink}>
        <Avatar src={avatar} size={56} isOnline={isOnline} />
      </Link>
      <div className={styles.info}>
        <Link href={ROUTES.profile(username)} className={styles.nameLink}>
          <span className={styles.name}>{name}</span>
        </Link>
        <span className={cn(styles.status, { [styles.online]: isOnline })}>
          {status}
        </span>
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
      {children}
    </li>
  );
};
