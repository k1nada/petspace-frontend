import styles from "@/app/features/messages/MessagesLayout/MessagesLayout.module.scss";
import { HeaderSkeleton } from "@/app/components/Header/HeaderSkeleton";
import { SidebarSkeleton } from "@/app/components/Sidebar/SidebarSkeleton";
import { ContactListSkeleton } from "@/app/features/messages/ContactList/ContactListSkeleton";
import { ChatSkeleton } from "@/app/features/messages/Chat/ChatSkeleton";

const MessagesLoading = () => (
  <>
    <HeaderSkeleton />
    <main>
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <SidebarSkeleton />
        </div>
        <div className={styles.chat}>
          <ContactListSkeleton />
          <ChatSkeleton />
        </div>
      </div>
    </main>
  </>
);

export default MessagesLoading;
