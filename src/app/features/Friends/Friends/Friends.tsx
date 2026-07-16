"use client";

import styles from "./Friends.module.scss";
import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { SearchBar } from "@/app/uikit/navigation/SearchBar/SearchBar";
import { Tab } from "@/app/uikit/navigation/Tab/Tab";
import { FriendCard } from "../FriendCard/FriendCard";
import { Friend, FollowUser } from "@/types";
import { FriendRequest } from "../FriendRequest/FriendRequest";
import { useUserStore } from "@/app/hooks/useUserStore";
import { FollowList } from "../FollowList/FollowList";
import { FriendsSkeleton } from "./FriendsSkeleton";

type FriendsTab = "friends" | "requests" | "followers" | "following";

interface FriendsProps {
  username: string;
  friends: Friend[];
  followers: FollowUser[];
  following: FollowUser[];
  currentUser: string;
  isMyProfile: boolean;
}

export const Friends = ({
  username,
  friends: initialFriends,
  followers,
  following,
  currentUser,
  isMyProfile,
}: FriendsProps) => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as FriendsTab) || "friends";

  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState(initialFriends);

  const requestsCount = useUserStore((state) => state.requestCount);
  const isLoading = useUserStore((state) => state.isLoading);
  const loadedUser = useUserStore((state) => state.currentUser);

  const filtered = useMemo(
    () =>
      friends.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [friends, search],
  );

  const deleteFriend = (friendUsername: string) =>
    setFriends((prev) => prev.filter((f) => f.username !== friendUsername));

  const goToTab = (tab: FriendsTab) => router.push(`?tab=${tab}`);

  if (isLoading && !loadedUser) return <FriendsSkeleton />;

  const tabs = [
    { key: "friends", label: t("friends.friendsTitle"), count: friends.length },
    {
      key: "requests",
      label: t("friends.requestsTitle"),
      count: requestsCount,
      hidden: !isMyProfile,
    },
    {
      key: "followers",
      label: t("friends.followersTitle"),
      count: followers.length,
    },
    {
      key: "following",
      label: t("friends.followingTitle"),
      count: following.length,
    },
  ] satisfies {
    key: FriendsTab;
    label: string;
    count: number;
    hidden?: boolean;
  }[];

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        {tabs
          .filter((tab) => !tab.hidden)
          .map(({ key, label, count }) => (
            <Tab
              key={key}
              label={label}
              count={count}
              isActive={activeTab === key}
              onClick={() => goToTab(key)}
            />
          ))}
      </div>

      {activeTab === "friends" &&
        (filtered.length > 0 ? (
          <>
            <SearchBar onChange={setSearch} fullWidth />
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
          </>
        ) : (
          <div className={styles.emptyFriends}>
            <p className={styles.emptyTitle}>
              {t("friends.emptyFriendsTitle")}
            </p>
            <p className={styles.emptyText}>{t("friends.emptyFriendsText")}</p>
          </div>
        ))}

      {activeTab === "requests" && isMyProfile && <FriendRequest />}

      {activeTab === "followers" && (
        <FollowList
          key="followers"
          initialUsers={followers}
          type="followers"
          username={username}
          currentUser={currentUser}
          isMyProfile={isMyProfile}
        />
      )}

      {activeTab === "following" && (
        <FollowList
          key="following"
          initialUsers={following}
          type="following"
          username={username}
          currentUser={currentUser}
          isMyProfile={isMyProfile}
        />
      )}
    </section>
  );
};
