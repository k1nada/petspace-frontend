"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./Friends.module.scss";
import { SearchBar } from "@/app/uikit/navigation/SearchBar/SearchBar";
import { FriendCard } from "../FriendCard/FriendCard";
import { Friend } from "@/types";

interface FriendsProps {
  friends: Friend[];
  currentUser: string;
  isMyProfile: boolean;
}

export const Friends = ({
  friends: initialFriends,
  currentUser,
  isMyProfile,
}: FriendsProps) => {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState(initialFriends);

  const filtered = friends.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  const deleteFriend = (friendUsername: string) => {
    setFriends((prev) =>
      prev.filter((friend) => friend.username !== friendUsername),
    );
  };

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
            <FriendCard
              key={friend.id}
              friend={friend}
              currentUser={currentUser}
              isOwner={isMyProfile}
              onFriendDeleted={deleteFriend}
            />
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
