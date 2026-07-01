"use client";

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
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
import api from "@/config/axios";
import { toast } from "react-toastify";

interface ChatProps {
  conversations: ChatContact[];
  user: User;
  selectedChat?: ChatContact;
  onMessageUpdate?: (contactId: string, lastMessage: Message) => void;
}

const socket = io(process.env.NEXT_PUBLIC_API_URL);

export const Chat = ({
  user,
  conversations,
  selectedChat,
  onMessageUpdate,
}: ChatProps) => {
  const t = useTranslations();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [online, setOnline] = useState(selectedChat?.isOnline ?? false);
  const listRef = useRef<HTMLUListElement>(null);

  const roomId = selectedChat
    ? [user.id, selectedChat.id].sort().join("_")
    : null;

  useEffect(() => {
    socket.emit("online", user.id);
  }, [user.id]);
  useEffect(() => {
    conversations.forEach(async (contact) => {
      const contactRoomId = [user.id, contact.id].sort().join("_");
      try {
        const { data } = await api.get(`/chat/${contactRoomId}`);
        if (data.length > 0 && onMessageUpdate) {
          onMessageUpdate(contact.id, data[data.length - 1]);
        }
      } catch {
        toast.error(t("toasts.error"));
      }
    });
  }, [conversations, user.id, onMessageUpdate]);

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

    const handleStatus = ({ userId, isOnline }: any) => {
      if (userId === selectedChat?.id) setOnline(isOnline);
    };

    socket.on("message", handleMessage);
    socket.on("statusChange", handleStatus);

    return () => {
      socket.off("message", handleMessage);
      socket.off("statusChange", handleStatus);
    };
  }, [roomId, selectedChat?.id, onMessageUpdate, selectedChat]);

  const handleSend = () => {
    socket.emit("message", { roomId, senderId: user.id, text: message });
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
                {online && <span className={styles.online}>online</span>}
              </div>
            </div>
          </div>
          <ul className={styles.list} ref={listRef}>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                text={msg.text}
                time={formatTime(msg.createdAt)}
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
