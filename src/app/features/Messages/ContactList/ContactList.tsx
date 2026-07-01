"use client";

import { useTranslations } from "next-intl";
import styles from "./ContactList.module.scss";
import { SearchBar } from "@/app/uikit/navigation/SearchBar/SearchBar";
import { Button } from "@/app/uikit/form/Button/Button";
import { ROUTES } from "@/routes/routes";
import { useRouter } from "next/navigation";
import { ChatContact, User } from "@/types";
import { ContactCard } from "../ContactCard/ContactCard";

interface ContactListProps {
  conversations: ChatContact[];
  user: User;
  onSelectContact: (contact: ChatContact) => void;
}

export const ContactList = ({
  conversations = [],
  user,
  onSelectContact,
}: ContactListProps) => {
  const t = useTranslations();
  const router = useRouter();

  const findFriends = () => {
    router.push(ROUTES.friends(user.username));
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t("contactList.title")}</h1>
        </div>
        <SearchBar />
      </div>
      <ul className={styles.list}>
        {conversations.length > 0 ? (
          conversations.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onClick={() => onSelectContact(contact)}
            />
          ))
        ) : (
          <div className={styles.emptyMessages}>
            <p className={styles.emptyText}>
              {t("contactList.emptyTitle")}
              <br />
              {t("contactList.emptyText")}
            </p>
            <Button appearance="primary" onClick={findFriends}>
              {t("contactList.findFriends")}
            </Button>
          </div>
        )}
      </ul>
    </div>
  );
};
