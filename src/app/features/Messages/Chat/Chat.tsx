"use client";

import { useState, useEffect, useRef } from "react";
import socket from "@/services/socket";
import styles from "./Chat.module.scss";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { SubmitTextarea } from "@/app/uikit/form/SubmitTextarea/SumbitTextarea";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/routes/routes";
import { API_URL } from "@/config/env";
import { ChatContact, Message, User } from "@/types";
import { ChatMessage } from "../ChatMessage/ChatMessage";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { formatTime } from "@/utils/dateFormatters";
import { useLocale } from "next-intl";

interface ChatProps {
  conversations: ChatContact[];
  user: User;
  selectedChat?: ChatContact;
  onMessageUpdate?: (contactId: string, lastMessage: Message) => void;
}

export const Chat = ({
  user,
  conversations,
  selectedChat,
  onMessageUpdate,
}: ChatProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [online, setOnline] = useState(selectedChat?.isOnline ?? false);
  const listRef = useRef<HTMLUListElement>(null);

  const roomId = selectedChat
    ? [user.id, selectedChat.id].sort().join("_")
    : null;

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!roomId) return;

    fetch(`${API_URL}/chat/${roomId}`)
      .then((res) => res.json())
      .then((msgs) => setMessages(msgs));

    socket.emit("join", roomId);

    const handleMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      if (selectedChat && onMessageUpdate) {
        onMessageUpdate(selectedChat.id, msg);
      }
    };

    const handleStatus = ({
      userId,
      isOnline,
    }: {
      userId: string;
      isOnline: boolean;
    }) => {
      if (userId === selectedChat?.id) setOnline(isOnline);
    };

    socket.on("message", handleMessage);
    socket.on("statusChange", handleStatus);

    return () => {
      socket.emit("leave", roomId);
      socket.off("message", handleMessage);
      socket.off("statusChange", handleStatus);
    };
  }, [roomId, selectedChat, onMessageUpdate]);

  const handleSend = () => {
    socket.emit("message", { roomId, text: message });
    setMessage("");
  };

  return (
    <section className={styles.container}>
      {selectedChat ? (
        <>
          <div className={styles.userInfo}>
            <div className={styles.user}>
              <Link href={ROUTES.profile(selectedChat.username)}>
                <Avatar src={selectedChat.avatar} size={45} />
              </Link>
              <div className={styles.info}>
                <span className={styles.name}>{selectedChat.name}</span>
                <span className={online ? styles.online : styles.status}>
                  {online ? t("common.online") : t("chat.offline")}
                </span>
              </div>
            </div>
          </div>
          <ul className={styles.list} ref={listRef}>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                text={msg.text}
                time={formatTime(msg.createdAt, locale)}
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
      ) : conversations.length > 0 ? (
        <div className={styles.emptyMessages}>
          <p className={styles.emptyTitle}>{t("chat.selectFriend")}</p>
        </div>
      ) : (
        <div className={styles.emptyMessages}>
          <p className={styles.emptyTitle}>{t("chat.noBarks")}</p>
          <p className={styles.emptyText}>{t("chat.emptyInbox")}</p>
        </div>
      )}
    </section>
  );
};
