"use client";

import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import styles from "./MessagesLayout.module.scss";
import { Chat } from "../Chat/Chat";
import { ChatContact, Message, User } from "@/types";
import { ContactList } from "../ContactList/ContactList";
import { getConversations } from "@/services/api/conversations";
import socket from "@/services/socket";

interface MessagesLayoutProps {
  user: User;
  initialSelectedChat?: ChatContact;
}

const mergeSelectedChat = (
  conversations: ChatContact[],
  selectedChat?: ChatContact,
) => {
  if (!selectedChat) return conversations;

  const base = conversations.some((conv) => conv.id === selectedChat.id)
    ? conversations
    : [selectedChat, ...conversations];

  return base.map((conv) =>
    conv.id === selectedChat.id ? { ...conv, unreadCount: 0 } : conv,
  );
};

export const MessagesLayout = ({
  user,
  initialSelectedChat,
}: MessagesLayoutProps) => {
  const [selectedChat, setSelectedChat] = useState<ChatContact | undefined>(
    initialSelectedChat,
  );
  const [conversations, setConversations] = useState<ChatContact[]>(() =>
    mergeSelectedChat([], initialSelectedChat),
  );

  useEffect(() => {
    getConversations(user.username).then((data) => {
      setConversations(mergeSelectedChat(data, initialSelectedChat));
    });
  }, [user.username, initialSelectedChat]);

  useEffect(() => {
    const handleNewMessage = () => {
      getConversations(user.username).then((data) => {
        setConversations(mergeSelectedChat(data, selectedChat));
      });
    };

    const handleStatus = ({
      userId,
      isOnline,
    }: {
      userId: string;
      isOnline: boolean;
    }) => {
      setConversations((prev) =>
        prev.map((conv) => (conv.id === userId ? { ...conv, isOnline } : conv)),
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("statusChange", handleStatus);
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("statusChange", handleStatus);
    };
  }, [user.username, selectedChat]);

  const updateLastMessage = useCallback(
    (contactId: string, message: Message) => {
      const lastMessage = {
        id: message.id,
        text: message.text,
        createdAt: message.createdAt,
        hasPost: !!message.post,
      };
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === contactId ? { ...conv, lastMessage } : conv,
        ),
      );
    },
    [],
  );

  const handleSelectContact = useCallback((contact: ChatContact) => {
    setSelectedChat(contact);
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === contact.id ? { ...conv, unreadCount: 0 } : conv,
      ),
    );
  }, []);

  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.chat}>
        <ContactList
          user={user}
          conversations={conversations}
          onSelectContact={handleSelectContact}
        />
        <Chat
          key={selectedChat?.id}
          user={user}
          conversations={conversations}
          selectedChat={selectedChat}
          onMessageUpdate={updateLastMessage}
        />
      </div>
    </div>
  );
};
