"use client";

import { ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import { SearchBar } from "@/app/uikit/navigation/SearchBar/SearchBar";
import { Button } from "@/app/uikit/form/Button/Button";
import { EmptyState } from "@/app/uikit/feedback/EmptyState/EmptyState";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
import { ROUTES } from "@/routes/routes";
import { useRouter } from "@/i18n/navigation";
import { ChatContact, MessageSearchResult, User } from "@/types";
import {
  MIN_MESSAGE_SEARCH_LENGTH,
  useMessageSearch,
} from "@/app/hooks/messages/useMessageSearch";
import { prefetchRoomMessages } from "@/app/hooks/messages/syncRoomMessages";
import { getRoomId } from "@/utils/chat";
import { MessageSearchItem } from "../MessageSearchItem/MessageSearchItem";
import { MessageSearchItemSkeleton } from "../MessageSearchItem/MessageSearchItemSkeleton";
import { ContactCard } from "../ContactCard/ContactCard";
import { ContactListSkeleton } from "./ContactListSkeleton";
import styles from "./ContactList.module.scss";

interface ContactListProps {
  conversations: ChatContact[];
  user: User;
  activeContactId?: string;
  loading?: boolean;
  loadFailed?: boolean;
  onRetry?: () => void;
  onSelectContact: (contact: ChatContact) => void;
}

export const ContactList = ({
  conversations,
  user,
  activeContactId,
  loading,
  loadFailed,
  onRetry,
  onSelectContact,
}: ContactListProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { messages: foundMessages, isLoading: isSearchingMessages } =
    useMessageSearch(search);

  const searchText = search.trim().toLowerCase();
  const isMessageSearch = searchText.length >= MIN_MESSAGE_SEARCH_LENGTH;
  const filteredConversations = conversations.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchText) ||
      contact.username.toLowerCase().includes(searchText),
  );

  const openMessage = (message: MessageSearchResult) => {
    const contact = conversations.find(
      (item) => item.id === message.partner.id,
    );
    if (contact) {
      onSelectContact(contact);
      return;
    }
    router.push(ROUTES.messages(user.username, message.partner.username));
  };

  const findFriends = () => {
    router.push(ROUTES.friends(user.username));
  };

  if (loading) return <ContactListSkeleton />;

  let listContent: ReactNode;
  if (loadFailed) {
    listContent = (
      <EmptyState
        center
        text={t("chat.listLoadFailed")}
        action={
          <Button appearance="primary" onClick={onRetry}>
            {t("chat.retry")}
          </Button>
        }
      />
    );
  } else if (conversations.length === 0) {
    listContent = (
      <EmptyState
        center
        text={
          <>
            {t("common.noFriendsText")}
            <br />
            {t("contactList.emptyText")}
          </>
        }
        action={
          <Button appearance="primary" onClick={findFriends}>
            {t("contactList.findFriends")}
          </Button>
        }
      />
    );
  } else if (isMessageSearch) {
    const hasResults =
      filteredConversations.length > 0 || foundMessages.length > 0;
    listContent = (
      <>
        {filteredConversations.length > 0 && (
          <li className={styles.sectionTitle}>
            {t("contactList.chatsSection")}
          </li>
        )}
        {filteredConversations.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            isActive={contact.id === activeContactId}
            onClick={() => onSelectContact(contact)}
            onHover={() => prefetchRoomMessages(getRoomId(user.id, contact.id))}
          />
        ))}
        {foundMessages.length > 0 && (
          <li className={styles.sectionTitle}>
            {t("contactList.messagesSection")}
          </li>
        )}
        {foundMessages.map((message) => (
          <MessageSearchItem
            key={message.id}
            message={message}
            query={search.trim()}
            onClick={() => openMessage(message)}
          />
        ))}
        {isSearchingMessages && filteredConversations.length === 0 && (
          <MessageSearchItemSkeleton />
        )}
        {!hasResults && !isSearchingMessages && (
          <EmptyState compact text={t("contactList.nothingFound")} />
        )}
      </>
    );
  } else if (filteredConversations.length === 0) {
    listContent = <EmptyState compact text={t("friends.noSearchResults")} />;
  } else {
    listContent = filteredConversations.map((contact) => (
      <ContactCard
        key={contact.id}
        contact={contact}
        isActive={contact.id === activeContactId}
        onClick={() => onSelectContact(contact)}
        onHover={() => prefetchRoomMessages(getRoomId(user.id, contact.id))}
      />
    ));
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.header}>
          <CardTitle as="h1">{t("common.messages")}</CardTitle>
        </div>
        <SearchBar value={search} onChange={setSearch} />
      </div>
      <ul className={styles.list}>{listContent}</ul>
    </div>
  );
};
