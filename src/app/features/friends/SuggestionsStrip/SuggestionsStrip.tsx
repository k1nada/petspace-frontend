"use client";

import { useTranslations } from "next-intl";
import cn from "classnames";
import { MdAdd, MdCheck, MdInfoOutline } from "react-icons/md";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { Card } from "@/app/uikit/layout/Card/Card";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
import { Dropdown } from "@/app/uikit/overlays/Dropdown/Dropdown";
import { ROUTES } from "@/routes/routes";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { useSuggestedFriends } from "@/app/hooks/friends/useSuggestedFriends";
import { getRelationshipStatus } from "@/utils/friends";
import styles from "./SuggestionsStrip.module.scss";

const AVATAR_SIZE = 56;

interface SuggestionsStripProps {
  tipText: string;
}

export const SuggestionsStrip = ({ tipText }: SuggestionsStripProps) => {
  const t = useTranslations();
  const currentUser = useAuthStore((state) => state.currentUser);
  const { suggestions, loadingUsername, requestFriend, cancelRequest } =
    useSuggestedFriends(currentUser);

  if (!suggestions.length) return null;

  return (
    <Card as="section">
      <div className={styles.header}>
        <CardTitle>{t("suggestedFriends.title")}</CardTitle>
        <Dropdown
          align="center"
          label={t("common.didYouKnow")}
          trigger={<MdInfoOutline size={18} />}
          className={styles.info}
          content={
            <div className={styles.popover}>
              <p className={styles.popoverTitle}>{t("common.didYouKnow")}</p>
              <p className={styles.popoverText}>{tipText}</p>
            </div>
          }
        />
      </div>
      <ul className={styles.list}>
        {suggestions.map((friend) => {
          const { isPending } = getRelationshipStatus(currentUser, friend.id);

          return (
            <li key={friend.username} className={styles.item}>
              <div className={styles.avatar}>
                <Link href={ROUTES.profile(friend.username)}>
                  <Avatar src={friend.avatar} size={AVATAR_SIZE} />
                </Link>
                {isPending ? (
                  <button
                    type="button"
                    className={cn(styles.badge, styles.badgeSent)}
                    title={t("profileBanner.cancelRequest")}
                    onClick={() => cancelRequest(friend.username)}
                    disabled={loadingUsername === friend.username}
                  >
                    <MdCheck size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles.badge}
                    title={t("common.addFriend")}
                    onClick={() => requestFriend(friend.username)}
                    disabled={loadingUsername === friend.username}
                  >
                    <MdAdd size={14} />
                  </button>
                )}
              </div>
              <Link
                href={ROUTES.profile(friend.username)}
                className={styles.name}
              >
                {friend.name || friend.username}
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};
