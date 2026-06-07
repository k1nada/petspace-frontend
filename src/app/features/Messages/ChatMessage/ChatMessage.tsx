import cn from "classnames";
import styles from "./ChatMessage.module.scss";

interface ChatMessageProps {
  text: string;
  time: string;
  isOwn?: boolean;
}

export const ChatMessage = ({ text, time, isOwn }: ChatMessageProps) => (
  <li className={cn(styles.message, { [styles.own]: isOwn })}>
    <div className={styles.content}>
      <span className={styles.text}>{text}</span>
      <span className={styles.time}>{time}</span>
    </div>
  </li>
);
