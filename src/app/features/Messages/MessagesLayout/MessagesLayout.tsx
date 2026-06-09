"use client";

import { useState } from "react";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import styles from "./MessagesLayout.module.scss";
import { Chat } from "../Chat/Chat";
import { ChatContact, Message, User } from "@/types";
import { ContactList } from "../ConversationList/ContactList";

interface MessagesLayoutProps {
  conversations: ChatContact[];
  user: User;
}

export const MessagesLayout = ({
  user,
  conversations: initialConversations = [],
}: MessagesLayoutProps) => {
  const [selectedChat, setSelectedChat] = useState<ChatContact | undefined>();
  const [conversations, setConversations] =
    useState<ChatContact[]>(initialConversations);

  const updateLastMessage = (contactId: string, lastMessage: Message) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === contactId ? { ...conv, lastMessage } : conv
      )
    );
  };

  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.chat}>
        <ContactList
          user={user}
          conversations={conversations}
          onSelectContact={setSelectedChat}
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
