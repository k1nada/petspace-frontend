"use client";

import { useState } from "react";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import styles from "./MessagesLayout.module.scss";
import { ConversationList } from "../ConversationList/ConversationList";
import { Chat } from "../Chat/Chat";
import { Friend, User } from "@/types";

interface MessagesLayoutProps {
  friends: Friend[];
  user: User;
}

export const MessagesLayout = ({ user, friends = [] }: MessagesLayoutProps) => {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.chat}>
        <ConversationList
          user={user}
          friends={friends}
          onSelectFriend={setSelectedFriend}
        />
        <Chat
          key={selectedFriend?.id}
          user={user}
          friends={friends}
          selectedFriend={selectedFriend}
        />
      </div>
    </div>
  );
};
