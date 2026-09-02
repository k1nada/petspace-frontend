"use client";

import styles from "./FriendRequestCard.module.scss";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { Button } from "@/app/uikit/form/Button/Button";
import { useTranslations } from "next-intl";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { ROUTES } from "@/routes/routes";
import { FriendRequest as FriendRequestType } from "@/types";

interface FriendRequestCardProps {
  request: FriendRequestType;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export const FriendRequestCard = ({
  request,
  onAccept,
  onReject,
}: FriendRequestCardProps) => {
  const t = useTranslations();

  return (
    <li className={styles.card}>
      <Link href={ROUTES.profile(request.from.username)}>
        <Avatar
          src={request.from.avatar}
          size={70}
          isOnline={request.from.isOnline}
        />
      </Link>
      <div className={styles.info}>
        <Link href={ROUTES.profile(request.from.username)}>
          <div className={styles.name}>{request.from.name}</div>
        </Link>
        <div className={styles.status}>
          {t("friendRequest.wantsToBeFriends")}
        </div>
      </div>
      <div className={styles.actions}>
        <Button appearance="primary" onClick={() => onAccept(request.id)}>
          {t("friendRequest.accept")}
        </Button>
        <Button appearance="secondary" onClick={() => onReject(request.id)}>
          {t("friendRequest.decline")}
        </Button>
      </div>
    </li>
  );
};
