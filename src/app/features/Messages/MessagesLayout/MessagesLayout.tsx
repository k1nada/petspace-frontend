"use client";

import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import styles from "./MessagesLayout.module.scss";
import { MessagesList } from "../MessagesList/MessagesList";
import { Messages } from "../Messages/Messages";


export const MessagesLayout = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Sidebar/>
      </div>
      <div className={styles.chat}>
        <MessagesList />
        <Messages />
      </div>
    </div>
  );
};
