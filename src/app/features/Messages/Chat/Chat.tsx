"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import styles from "./Chat.module.scss";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { SubmitTextarea } from "@/app/uikit/form/SubmitTextarea/SumbitTextarea";
import { useTranslations } from "next-intl";
import { Button } from "@/app/uikit/form/Button/Button";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routes/routes";
import { API_URL } from "@/config/env";
import { Friend, Message, User } from "@/types";
import { ChatMessage } from "../ChatMessage/ChatMessage";
import { Link } from "@/app/uikit/navigation/Link/Link";

interface ChatProps {
  friends: Friend[];
  user: User;
  selectedFriend: Friend | null;
}

const socket = io(process.env.NEXT_PUBLIC_API_URL);

export const Chat = ({ user, friends, selectedFriend }: ChatProps) => {
  const t = useTranslations();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [online, setOnline] = useState(selectedFriend?.isOnline ?? false);
  const router = useRouter();

  const roomId = selectedFriend
    ? [user.id, selectedFriend.id].sort().join("_")
    : null;

  useEffect(() => {
    socket.emit("online", user.id);
  }, [user.id]);

  useEffect(() => {
    if (!roomId) return;

    fetch(`${API_URL}/chat/${roomId}`)
      .then((res) => res.json())
      .then(setMessages);

    socket.emit("join", roomId);

    const onMessage = (msg: Message) => setMessages((prev) => [...prev, msg]);
    const onStatus = ({
      userId,
      isOnline,
    }: {
      userId: string;
      isOnline: boolean;
    }) => {
      if (userId === selectedFriend?.id) setOnline(isOnline);
    };

    socket.on("message", onMessage);
    socket.on("statusChange", onStatus);

    return () => {
      socket.off("message", onMessage);
      socket.off("statusChange", onStatus);
    };
  }, [roomId]);

  const handleSend = () => {
    if (!message.trim() || !roomId) return;
    socket.emit("message", { roomId, senderId: user.id, text: message });
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
                <span className={styles.name}>{selectedFriend.name}</span>
                {online && <span className={styles.online}>online</span>}
              </div>
            </div>
          </div>
          <ul className={styles.list}>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                text={msg.text}
                time={new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                isOwn={msg.sender?.id === user.id}
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
