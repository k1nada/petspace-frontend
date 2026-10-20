"use client";

import { ReactNode } from "react";
import cn from "classnames";
import { useTranslations } from "next-intl";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { Button } from "@/app/uikit/form/Button/Button";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { ROUTES } from "@/routes/routes";
import {
  useLastSeenText,
  useUserPresence,
} from "@/app/hooks/shared/useUserPresence";
import styles from "./UserRow.module.scss";

const AVATAR_SIZE = 56;

interface UserRowProps {
  userId?: string;
  username: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  fallbackStatus: string;
  onMessage?: () => void;
  actions?: ReactNode;
  children?: ReactNode;
}

export const UserRow = ({
  userId,
  username,
  name,
  avatar,
  isOnline,
  lastSeen,
  fallbackStatus,
  onMessage,
  actions,
  children,
}: UserRowProps) => {
  const t = useTranslations();
  const presence = useUserPresence({ id: userId, isOnline, lastSeen });
  const lastSeenText = useLastSeenText(presence.lastSeen);

  let status = fallbackStatus;
  if (lastSeenText) status = lastSeenText;
  if (presence.isOnline) status = t("common.online");

  return (
    <li className={styles.row}>
      <Link href={ROUTES.profile(username)} className={styles.avatarLink}>
        <Avatar src={avatar} size={AVATAR_SIZE} isOnline={presence.isOnline} />
      </Link>
      <div className={styles.info}>
        <Link href={ROUTES.profile(username)} className={styles.nameLink}>
          <span className={styles.name}>{name}</span>
        </Link>
        <span
          className={cn(styles.status, { [styles.online]: presence.isOnline })}
        >
          {status}
        </span>
      </div>
      {(onMessage || actions) && (
        <div className={styles.actions}>
          {onMessage && (
            <Button appearance="primary" onClick={onMessage}>
              {t("friends.message")}
            </Button>
          )}
          {actions}
        </div>
      )}
      {children}
    </li>
  );
};
