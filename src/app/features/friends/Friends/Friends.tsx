"use client";

import styles from "./Friends.module.scss";
import { useTranslations } from "next-intl";
import { SearchBar } from "@/app/uikit/navigation/SearchBar/SearchBar";
import { Tab } from "@/app/uikit/navigation/Tab/Tab";
import { FaPaw } from "react-icons/fa";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";
import { Dropdown } from "@/app/uikit/overlays/Dropdown/Dropdown";
import { EmptyState } from "@/app/uikit/feedback/EmptyState/EmptyState";
import { FriendCard } from "../FriendCard/FriendCard";
import { Friend, FollowUser } from "@/types";
import { FriendRequest } from "../FriendRequest/FriendRequest";
import { FollowList } from "../FollowList/FollowList";
import { useFriendsTab } from "@/app/hooks/friends/useFriendsTab";
import { useFriendsList } from "@/app/hooks/friends/useFriendsList";
import { useFollowLists } from "@/app/hooks/friends/useFollowLists";
import { Card } from "@/app/uikit/layout/Card/Card";

interface FriendsProps {
  username: string;
  name: string;
  friends: Friend[];
  followers: FollowUser[];
  following: FollowUser[];
  currentUser: string;
  isMyProfile: boolean;
}

export const Friends = ({
  username,
  name,
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
    addFollowing,
    unfollowAll,
    isConfirmAllOpen,
    openConfirmAll,
    closeConfirmAll,
  } = useFollowLists({ username, followers, following });

  const { activeTab, goToTab, tabs } = useFriendsTab({
    isMyProfile,
    name,
    friendsCount,
    followersCount,
    followingCount,
  });

  const canUnfollowAll =
    activeTab === "following" && isMyProfile && followingCount > 0;

  return (
    <Card as="section">
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
          <div className={styles.menu}>
            <Dropdown
              label={t("friends.manageFollowing")}
              items={[
                {
                  label: t("friends.unfollowAll"),
                  icon: <FaPaw size={16} />,
                  onClick: openConfirmAll,
                },
              ]}
            />
          </div>
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
            title={t("common.noFriendsYet")}
            text={t("friends.emptyFriendsText")}
          />
        ))}

      {activeTab === "requests" && isMyProfile && <FriendRequest />}

      {activeTab === "followers" && isMyProfile && (
        <FollowList
          key="followers"
          users={followersList}
          type="followers"
          username={username}
          currentUser={currentUser}
          isMyProfile={isMyProfile}
          onRemove={removeFollower}
          onFollowBack={addFollowing}
        />
      )}

      {activeTab === "following" && isMyProfile && (
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
        title={t("followCard.unfollowAllModalTitle", {
          count: followingCount,
        })}
        description={t("followCard.unfollowModalDescription")}
        confirmLabel={t("friends.unfollowAll")}
        onConfirm={unfollowAll}
        onClose={closeConfirmAll}
      />
    </Card>
  );
};
