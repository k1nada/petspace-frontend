"use client";

import { useState } from "react";
import styles from "./Chat.module.scss";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { SubmitTextarea } from "@/app/uikit/form/SubmitTextarea/SumbitTextarea";
import { useTranslations } from "next-intl";
import { Button } from "@/app/uikit/form/Button/Button";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routes/routes";
import { Friend, Message, User } from "@/types";
import { ChatMessage } from "../ChatMessage/ChatMessage";
import { Link } from "@/app/uikit/navigation/Link/Link";

interface ChatProps {
  friends: Friend[];
  user: User;
  selectedFriend: Friend | null;
}

export const Chat = ({ user, friends, selectedFriend }: ChatProps) => {
  const t = useTranslations();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        text: message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setMessage("");
  };

  const findFriends = () => {
    router.push(ROUTES.friends(user.username));
  };

  return (
    <section className={styles.container}>
      {selectedFriend ? (
        <>
          <div className={styles.userInfo}>
            <div className={styles.user}>
              <Link href={ROUTES.profile(selectedFriend.username)}>
                <Avatar src={selectedFriend.avatar} size={45} />
              </Link>

              <div className={styles.info}>
                <strong className={styles.name}>{selectedFriend.name}</strong>
              </div>
            </div>
          </div>
          <ul className={styles.list}>
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                text={msg.text}
                time={msg.time}
                avatar={user.avatar}
                username={user.username}
              />
            ))}
          </ul>
          <div className={styles.input}>
            <SubmitTextarea
              value={message}
              onChange={setMessage}
              onSubmit={handleSend}
              placeholder={t("chat.placeholder")}
            />
          </div>
        </>
      ) : friends.length > 0 ? (
        <div className={styles.emptyMessages}>
          <p className={styles.emptyTitle}>{t("chat.selectFriend")}</p>
        </div>
      ) : (
        <div className={styles.emptyMessages}>
          <p className={styles.emptyTitle}>{t("chat.noBarks")}</p>
          <p className={styles.emptyText}>{t("chat.emptyInbox")}</p>
          <div>
            <Button appearance="primary" onClick={findFriends}>
              {t("chat.findDog")}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};
