"use client";

import styles from "./Friends.module.scss";
import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { SearchBar } from "@/app/uikit/navigation/SearchBar/SearchBar";
import { Tab } from "@/app/uikit/navigation/Tab/Tab";
import { Button } from "@/app/uikit/form/Button/Button";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";
import { FriendCard } from "../FriendCard/FriendCard";
import { Friend, FollowUser } from "@/types";
import { FriendRequest } from "../FriendRequest/FriendRequest";
import { useUserStore } from "@/app/hooks/useUserStore";
import { unfollowUser } from "@/app/api/follows";
import { FollowList } from "../FollowList/FollowList";
import { FriendsSkeleton } from "./FriendsSkeleton";
import { AuthLoader } from "@/app/components/AuthLoader/AuthLoader";

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
  followers: initialFollowers,
  following: initialFollowing,
  currentUser,
  isMyProfile,
}: FriendsProps) => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as FriendsTab) || "friends";

  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState(initialFriends);
  const [followers, setFollowers] = useState(initialFollowers);
  const [following, setFollowing] = useState(initialFollowing);
  const [isConfirmAllOpen, setIsConfirmAllOpen] = useState(false);

  const requestsCount = useUserStore((state) => state.requestCount);

  const filtered = useMemo(
    () =>
      friends.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [friends, search],
  );

  const deleteFriend = (friendUsername: string) =>
    setFriends((prev) => prev.filter((f) => f.username !== friendUsername));

  const removeFollower = (targetUsername: string) =>
    setFollowers((prev) => prev.filter((u) => u.username !== targetUsername));

  const removeFollowing = (targetUsername: string) =>
    setFollowing((prev) => prev.filter((u) => u.username !== targetUsername));

  const unfollowAll = async () => {
    setIsConfirmAllOpen(false);
    try {
      await Promise.all(
        following.map((u) => unfollowUser(username, u.username)),
      );
      setFollowing([]);
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const goToTab = (tab: FriendsTab) => router.push(`?tab=${tab}`);

  const canUnfollowAll =
    activeTab === "following" && isMyProfile && following.length > 0;

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
    <AuthLoader fallback={<FriendsSkeleton />}>
      <section className={styles.container}>
        <div className={styles.header}>
          <div className={styles.tabs}>
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

          {canUnfollowAll && (
            <Button
              appearance="secondary"
              onClick={() => setIsConfirmAllOpen(true)}
            >
              {t("friends.unfollowAll")}
            </Button>
          )}
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
              <p className={styles.emptyText}>
                {t("friends.emptyFriendsText")}
              </p>
            </div>
          ))}

        {activeTab === "requests" && isMyProfile && <FriendRequest />}

        {activeTab === "followers" && (
          <FollowList
            key="followers"
            users={followers}
            type="followers"
            username={username}
            currentUser={currentUser}
            isMyProfile={isMyProfile}
            onRemove={removeFollower}
          />
        )}

        {activeTab === "following" && (
          <FollowList
            key="following"
            users={following}
            type="following"
            username={username}
            currentUser={currentUser}
            isMyProfile={isMyProfile}
            onRemove={removeFollowing}
          />
        )}

        <ConfirmModal
          isOpen={isConfirmAllOpen}
          title={t("friends.unfollowAll")}
          description={t("followCard.unfollowAllModalDescription")}
          onConfirm={unfollowAll}
          onClose={() => setIsConfirmAllOpen(false)}
        />
      </section>
    </AuthLoader>
  );
};
