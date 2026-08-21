"use client";

import styles from "./Friends.module.scss";
import { useTranslations } from "next-intl";
import { SearchBar } from "@/app/uikit/navigation/SearchBar/SearchBar";
import { Tab } from "@/app/uikit/navigation/Tab/Tab";
import { Button } from "@/app/uikit/form/Button/Button";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";
import { EmptyState } from "@/app/uikit/feedback/EmptyState/EmptyState";
import { FriendCard } from "../FriendCard/FriendCard";
import { Friend, FollowUser } from "@/types";
import { FriendRequest } from "../FriendRequest/FriendRequest";
import { FollowList } from "../FollowList/FollowList";
import { FriendsSkeleton } from "./FriendsSkeleton";
import { AuthLoader } from "@/app/components/AuthLoader/AuthLoader";
import { useFriendsTab } from "@/app/hooks/useFriendsTab";
import { useFriendsList } from "@/app/hooks/useFriendsList";
import { useFollowLists } from "@/app/hooks/useFollowLists";

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
  friends,
  followers,
  following,
  currentUser,
  isMyProfile,
}: FriendsProps) => {
  const t = useTranslations();

  const { setSearch, friendsCount, hasFriends, friendsList, deleteFriend } =
    useFriendsList({ friends });

  const {
    followersList,
    followersCount,
    removeFollower,
    followingList,
    followingCount,
    removeFollowing,
    unfollowAll,
    isConfirmAllOpen,
    openConfirmAll,
    closeConfirmAll,
  } = useFollowLists({ username, followers, following });

  const { activeTab, goToTab, tabs } = useFriendsTab({
    isMyProfile,
    friendsCount,
    followersCount,
    followingCount,
  });

  const canUnfollowAll =
    activeTab === "following" && isMyProfile && followingCount > 0;

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
            <Button appearance="secondary" onClick={openConfirmAll}>
              {t("friends.unfollowAll")}
            </Button>
          )}
        </div>

        {activeTab === "friends" &&
          (hasFriends ? (
            <>
              <SearchBar onChange={setSearch} fullWidth />
              {friendsList.length > 0 ? (
                <ul className={styles.list}>
                  {friendsList.map((friend) => (
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
                <EmptyState compact text={t("friends.noSearchResults")} />
              )}
            </>
          ) : (
            <EmptyState
              title={t("friends.emptyFriendsTitle")}
              text={t("friends.emptyFriendsText")}
            />
          ))}

        {activeTab === "requests" && isMyProfile && <FriendRequest />}

        {activeTab === "followers" && (
          <FollowList
            key="followers"
            users={followersList}
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
            users={followingList}
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
          onClose={closeConfirmAll}
        />
      </section>
    </AuthLoader>
  );
};
