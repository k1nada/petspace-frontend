"use client";

import { useTranslations } from "next-intl";
import { Button } from "../../../../uikit/form/Button/Button";
import styles from "./ProfileBanner.module.scss";
import { FaMapMarkerAlt, FaPaw, FaTree, FaTrophy } from "react-icons/fa";
import { FaCamera, FaMessage } from "react-icons/fa6";
import { ROUTES } from "@/routes/routes";
import { Link } from "../../../../uikit/navigation/Link/Link";
import { useRouter } from "next/navigation";
import { AvatarEdit } from "@/app/uikit/user/AvatarEdit/AvatarEdit";
import { useState } from "react";
import { ProfileInfoModal } from "../../modals/ProfileInfoModal/ProfileInfoModal";
import { AchievementsModal } from "../../modals/AchievementsModal/AchievementsModal";
import { useUserStore } from "@/app/hooks/useUserStore";
import { BannerInfo } from "@/types";
import { ProfileBannerSkeleton } from "./ProfileBannerSkeleton";

interface ProfileBannerProps {
  bannerInfo: BannerInfo;
}

export const ProfileBanner = ({ bannerInfo }: ProfileBannerProps) => {
  const t = useTranslations();
  const router = useRouter();

  const friendsCount = bannerInfo.friends?.length ?? 0;
  const photosCount = bannerInfo.photos?.length ?? 0;

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    bannerInfo.avatar,
  );

  const hasMoreInfo = !!(
    bannerInfo.breed ||
    bannerInfo.birthDate ||
    bannerInfo.gender ||
    bannerInfo.bio ||
    (bannerInfo.interests && Object.values(bannerInfo.interests).some(Boolean))
  );

  const currentUser = useUserStore((state) => state.currentUser);
  const isOwner = currentUser?.username === bannerInfo.username;
  const isFriend = !!currentUser?.friends?.find((f) => f.id === bannerInfo.id);

  const editProfile = () => {
    router.push(ROUTES.editProfile(bannerInfo.username));
  };

  const goToMessages = (targetUsername: string) => {
    router.push(ROUTES.messages(currentUser?.username || "", targetUsername));
  };

  const addFriend = () => {
    console.log("Add friend:", bannerInfo.id);
    // TODO implement friend request
  };

  const isLoading = useUserStore((state) => state.isLoading);
  if (isLoading && !currentUser) return <ProfileBannerSkeleton />;

  return (
    <div className={styles.banner}>
      <div className={styles.avatarWrapper}>
        <AvatarEdit
          src={avatarUrl}
          name={bannerInfo.name}
          size={140}
          avatarPhotos={bannerInfo.avatarPhotos}
          onAvatarChange={(url) => setAvatarUrl(url)}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.info}>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{bannerInfo.name}</h1>
            <div className={styles.username}>@{bannerInfo.username} </div>
          </div>
          {(bannerInfo.city || hasMoreInfo) && (
            <div className={styles.details}>
              {bannerInfo.city && (
                <div className={styles.city}>
                  <FaMapMarkerAlt size={18} className={styles.icon} />
                  {bannerInfo.city}
                </div>
              )}
              {hasMoreInfo && (
                <div
                  className={styles.moreInfo}
                  onClick={() => setIsInfoOpen(true)}
                >
                  {t("profileBanner.info")}
                </div>
              )}
            </div>
          )}
        </div>
        {bannerInfo.bio && <div className={styles.bio}>{bannerInfo.bio}</div>}
        <div className={styles.divider}></div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <Link
              href={ROUTES.friends(bannerInfo.username)}
              appearance="secondary"
            >
              <FaPaw size={18} />
              <span className={styles.statValue}>{friendsCount}</span>
              <span className={styles.statLabel}>
                {t("profileBanner.friends")}
              </span>
            </Link>
          </div>
          <div className={styles.stat}>
            <Link
              href={ROUTES.photos(bannerInfo.username)}
              appearance="secondary"
            >
              <FaCamera size={18} />
              <span className={styles.statValue}>{photosCount}</span>
              <span className={styles.statLabel}>
                {t("profileBanner.photos")}
              </span>
            </Link>
          </div>
          <div className={styles.stat}>
            <Link
              href={ROUTES.familyTree(bannerInfo.username)}
              appearance="secondary"
            >
              <FaTree size={18} />
              <span className={styles.statLabel}>
                {t("profileBanner.familyTree")}
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.actions}>
        <Button
          appearance="secondary"
          onClick={() => setIsAchievementsOpen(true)}
        >
          <FaTrophy size={16} />
        </Button>
        {isOwner ? (
          <Button appearance="primary" onClick={editProfile}>
            {t("profileBanner.editProfile")}
          </Button>
        ) : isFriend ? (
          <>
            <Button appearance="secondary">
              <FaPaw size={16} />
            </Button>
            <Button appearance="primary" onClick={() => goToMessages(bannerInfo.username)}>
              {t("profileBanner.message")}
            </Button>
          </>
        ) : (
          <>
            <Button appearance="secondary" onClick={() => goToMessages(bannerInfo.username)}>
              <FaMessage size={16} />
            </Button>
            <Button appearance="primary" onClick={addFriend}>
              {t("profileBanner.addFriend")}
            </Button>
          </>
        )}
      </div>

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={bannerInfo.achievements}
      />

      <ProfileInfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        user={bannerInfo}
      />
    </div>
  );
};
