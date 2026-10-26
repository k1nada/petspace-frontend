"use client";

import { useLocale } from "next-intl";
import { Button } from "@/app/uikit/form/Button/Button";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { SKELETON_AVATAR } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import { formatDate } from "@/utils/dateFormatters";
import { MessageSearchResult } from "@/types";
import styles from "./MessageSearchItem.module.scss";

const SNIPPET_CONTEXT_LENGTH = 30;

interface MessageSearchItemProps {
  message: MessageSearchResult;
  query: string;
  onClick: () => void;
}

export const MessageSearchItem = ({
  message,
  query,
  onClick,
}: MessageSearchItemProps) => {
  const locale = useLocale();
  const matchIndex = message.text.toLowerCase().indexOf(query.toLowerCase());
  const isMatchFound = matchIndex !== -1;
  const start = Math.max(0, matchIndex - SNIPPET_CONTEXT_LENGTH);
  const before = (start > 0 ? "…" : "") + message.text.slice(start, matchIndex);
  const match = message.text.slice(matchIndex, matchIndex + query.length);
  const after = message.text.slice(matchIndex + query.length);

  return (
    <li className={styles.item}>
      <Button appearance="ghost" className={styles.button} onClick={onClick}>
        <Avatar
          src={message.partner.avatar}
          size={SKELETON_AVATAR.messageSearch}
        />
        <div className={styles.info}>
          <div className={styles.top}>
            <span className={styles.name}>
              {message.partner.name || `@${message.partner.username}`}
            </span>
            <span className={styles.date}>
              {formatDate(message.createdAt, locale)}
            </span>
          </div>
          <span className={styles.text}>
            {isMatchFound ? (
              <>
                {before}
                <mark className={styles.match}>{match}</mark>
                {after}
              </>
            ) : (
              message.text
            )}
          </span>
        </div>
      </Button>
    </li>
  );
};
