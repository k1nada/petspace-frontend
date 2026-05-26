import { Link } from "@/app/uikit/navigation/Link/Link";
import styles from "./ChatMessage.module.scss";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { ROUTES } from "@/routes/routes";

interface ChatMessageProps {
  text: string;
  time: string;
  avatar?: string;
  username: string;
}

export const ChatMessage = ({
  text,
  time,
  avatar,
  username,
}: ChatMessageProps) => (
  <li className={styles.message}>
    <Link href={ROUTES.profile(username)}>
      <Avatar src={avatar} size={35} />
    </Link>
    <div className={styles.content}>
      <span className={styles.text}>{text}</span>
      <span className={styles.time}>{time}</span>
    </div>
  </li>
);
