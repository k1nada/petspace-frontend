import cn from "classnames";
import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./ChatMessage.module.scss";
import { SharedPost } from "@/types";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { ROUTES } from "@/routes/routes";

interface ChatMessageProps {
  text: string;
  time: string;
  isOwn?: boolean;
  post?: SharedPost | null;
}

export const ChatMessage = ({ text, time, isOwn, post }: ChatMessageProps) => {
  const t = useTranslations();

  return (
    <li className={cn(styles.message, { [styles.own]: isOwn })}>
      <div className={styles.content}>
        {post ? (
          <div className={styles.postCard}>
            <Link
              href={ROUTES.profile(post.user.username)}
              className={styles.postAuthor}
            >
              {post.user.name}
            </Link>
            {post.image && (
              <div className={styles.postImage}>
                <Image src={post.image} alt={t("post.image")} fill />
              </div>
            )}
            {post.content && (
              <span className={styles.postContent}>{post.content}</span>
            )}
          </div>
        ) : (
          <span className={styles.text}>{text || t("chat.deletedPost")}</span>
        )}
        <span className={styles.time}>{time}</span>
      </div>
    </li>
  );
};
