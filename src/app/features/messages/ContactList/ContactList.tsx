"use client";

import { ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import { SearchBar } from "@/app/uikit/navigation/SearchBar/SearchBar";
import { Button } from "@/app/uikit/form/Button/Button";
import { EmptyState } from "@/app/uikit/feedback/EmptyState/EmptyState";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
import { ROUTES } from "@/routes/routes";
import { useRouter } from "@/i18n/navigation";
import { ChatContact, User } from "@/types";
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

  const filteredConversations = conversations.filter((contact) =>
    contact.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

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
  } else if (filteredConversations.length === 0) {
    listContent = <EmptyState compact text={t("friends.noSearchResults")} />;
  } else {
    listContent = filteredConversations.map((contact) => (
      <ContactCard
        key={contact.id}
        contact={contact}
        isActive={contact.id === activeContactId}
        onClick={() => onSelectContact(contact)}
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
