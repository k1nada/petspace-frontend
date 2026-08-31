"use client";

import { Postwall } from "../feed/Postwall/Postwall";
import { ProfileFriends } from "../friends/ProfileFriends/ProfileFriends";
import { PostCreator } from "../feed/PostCreator/PostCreator";
import { ProfileBanner } from "../info/ProfileBanner/ProfileBanner";
import styles from "./ProfileLayout.module.scss";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { ProfilePhotos } from "../photos/ProfilePhotos/ProfilePhotos";
import { useEffect, useState } from "react";
import { getPosts } from "@/services/api/post";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { getRelationshipStatus } from "@/utils/friends";
import { BannerInfo } from "@/types";
import { Post } from "@/types";

interface ProfileLayoutProps {
  bannerInfo: BannerInfo;
}

export const ProfileLayout = ({ bannerInfo }: ProfileLayoutProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(!!bannerInfo.postwallId);
  const currentUser = useAuthStore((state) => state.currentUser);
  const isOwner = currentUser?.username === bannerInfo.username;
  const { isFriend } = getRelationshipStatus(currentUser, bannerInfo.id);
  const postwallId = bannerInfo.postwallId;

  const triggerRefresh = () => {
    if (!postwallId) return;
    getPosts(postwallId).then((data) => setPosts(data ?? []));
  };

  useEffect(() => {
    if (!postwallId) return;
    getPosts(postwallId).then((data) => {
      setPosts(data ?? []);
      setPostsLoading(false);
    });
  }, [postwallId]);

  const friends = bannerInfo.friends ?? [];
  const photos = bannerInfo.photos ?? [];

  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.profileBanner}>
        <ProfileBanner bannerInfo={bannerInfo} />
      </div>
      <div className={styles.feedContainer}>
        {(isOwner || isFriend) && currentUser && (
          <PostCreator
            name={currentUser.name}
            avatar={currentUser.avatar}
            postwallId={bannerInfo.postwallId ?? ""}
            onSuccess={triggerRefresh}
          />
        )}
        <Postwall
          posts={posts}
          loading={postsLoading}
          onRefresh={triggerRefresh}
        />
      </div>
      <div className={styles.rightColumn}>
        <div className={styles.photos}>
          <ProfilePhotos
            username={bannerInfo.username}
            photos={photos}
            avatar={bannerInfo.avatar}
            name={bannerInfo.name}
          />
        </div>
        <div className={styles.friends}>
          <ProfileFriends username={bannerInfo.username} friends={friends} />
        </div>
      </div>
    </div>
  );
};
