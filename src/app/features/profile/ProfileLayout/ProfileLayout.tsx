"use client";

import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { getPosts } from "@/services/api/post";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { useProfilePostsStore } from "@/app/hooks/profile/useProfilePostsStore";
import { getRelationshipStatus } from "@/utils/friends";
import { BannerInfo } from "@/types";
import { Postwall } from "../feed/Postwall/Postwall";
import { ProfileFriends } from "../friends/ProfileFriends/ProfileFriends";
import { PostCreator } from "../feed/PostCreator/PostCreator";
import { ProfileBanner } from "../info/ProfileBanner/ProfileBanner";
import { ProfilePhotos } from "../photos/ProfilePhotos/ProfilePhotos";
import { ProfileLayoutSkeleton } from "./ProfileLayoutSkeleton";
import styles from "./ProfileLayout.module.scss";

interface ProfileLayoutProps {
  bannerInfo: BannerInfo;
}

export const ProfileLayout = ({ bannerInfo }: ProfileLayoutProps) => {
  const t = useTranslations();
  const currentUser = useAuthStore((state) => state.currentUser);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);
  const isOwner = currentUser?.username === bannerInfo.username;
  const { isFriend } = getRelationshipStatus(currentUser, bannerInfo.id);
  const postwallId = bannerInfo.postwallId;

  const storedPostwallId = useProfilePostsStore((state) => state.postwallId);
  const storedPosts = useProfilePostsStore((state) => state.posts);
  const hasLoaded = useProfilePostsStore((state) => state.hasLoaded);
  const setStoredPosts = useProfilePostsStore((state) => state.setPosts);

  const postsLoading =
    !!postwallId && !(hasLoaded && storedPostwallId === postwallId);
  const posts = storedPostwallId === postwallId ? storedPosts : [];

  const refreshPosts = () => {
    if (!postwallId) return;
    getPosts(postwallId)
      .then((data) => setStoredPosts(postwallId, data))
      .catch(() => toast.error(t("toasts.error")));
  };

  useEffect(() => {
    if (!postwallId) return;
    let cancelled = false;

    getPosts(postwallId)
      .then((data) => {
        if (!cancelled) setStoredPosts(postwallId, data);
      })
      .catch(() => {
        if (cancelled) return;
        toast.error(t("toasts.error"));
        if (useProfilePostsStore.getState().postwallId !== postwallId) {
          setStoredPosts(postwallId, []);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [postwallId, setStoredPosts, t]);

  const friends = bannerInfo.friends ?? [];
  const photos = bannerInfo.photos ?? [];
  const canCreatePost = isOwner || isFriend;

  if (!isAuthChecked || postsLoading) {
    return <ProfileLayoutSkeleton />;
  }

  return (
    <div className={styles.layout}>
      <div className={styles.profileBanner}>
        <ProfileBanner bannerInfo={bannerInfo} />
      </div>
      <div className={styles.feedContainer}>
        {canCreatePost && currentUser && (
          <PostCreator
            name={currentUser.name}
            isOwner={isOwner}
            avatar={currentUser.avatar}
            postwallId={postwallId ?? ""}
            onSuccess={refreshPosts}
          />
        )}
        <Postwall posts={posts} onRefresh={refreshPosts} />
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
