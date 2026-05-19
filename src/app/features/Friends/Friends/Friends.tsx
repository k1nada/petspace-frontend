"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./Friends.module.scss";
import { Friend } from "@/types";
import { SearchBar } from "@/app/uikit/navigation/SearchBar/SearchBar";
import { FriendCard } from "../FriendCard/FriendCard";

interface FriendsProps {
  friends?: Friend[];
}

export const Friends = ({ friends = [] }: FriendsProps) => {
  const t = useTranslations();
  const [search, setSearch] = useState("");

  const filtered = friends.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("friends.title")}</h1>
        <span className={styles.count}>{friends.length}</span>
      </div>
      <SearchBar onChange={setSearch} />
      {filtered.length > 0 ? (
        <ul className={styles.list}>
          {filtered.map((friend) => (
            <FriendCard key={friend.username} friend={friend} />
          ))}
        </ul>
      ) : (
        <div className={styles.emptyFriends}>
          <p className={styles.title}>{t("friends.emptyFriendsTitle")}</p>
          <p className={styles.text}>{t("friends.emptyFriendsText")}</p>
        </div>
      )}
    </section>
  );
};
