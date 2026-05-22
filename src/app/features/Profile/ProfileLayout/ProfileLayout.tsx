"use client";

import { Postwall } from "../feed/Postwall/Postwall";
import { ProfileFriends } from "../friends/ProfileFriends/ProfileFriends";
import { PostCreator } from "../feed/PostCreator/PostCreator";
import { ProfileBanner } from "../info/ProfileBanner/ProfileBanner";
import styles from "./ProfileLayout.module.scss";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { ProfilePhotos } from "../photos/ProfilePhotos/ProfilePhotos";
import { useState, useEffect } from "react";
import { getPosts } from "@/app/api/post";
import { useUserStore } from "@/app/hooks/useUserStore";
import { BannerInfo } from "@/types";
import { Post } from "@/types";

interface ProfileLayoutProps {
  bannerInfo: BannerInfo;
}

export const ProfileLayout = ({ bannerInfo }: ProfileLayoutProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const currentUser = useUserStore((state) => state.currentUser);
  const isOwner = currentUser?.username === bannerInfo.username;

  useEffect(() => {
    getPosts(bannerInfo.postwallId!).then((data) => {
      setPosts(data ?? []);
      setLoading(false);
    });
  }, [refresh, bannerInfo.postwallId]);

  const triggerRefresh = () => setRefresh((r) => r + 1);
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
        {isOwner && (
          <PostCreator
            username={currentUser.username}
            name={currentUser.name}
            avatar={currentUser.avatar}
            postwallId={bannerInfo.postwallId ?? ""}
            onSuccess={triggerRefresh}
          />
        )}
        <Postwall posts={posts} loading={loading} onRefresh={triggerRefresh} />
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
