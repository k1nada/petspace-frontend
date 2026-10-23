"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { FaMapMarkerAlt, FaPaw, FaTree, FaTrophy } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { Button } from "@/app/uikit/form/Button/Button";
import { PhotoIcon } from "@/app/uikit/brand/PhotoIcon/PhotoIcon";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { Card } from "@/app/uikit/layout/Card/Card";
import { ConfirmModal } from "@/app/uikit/overlays/ConfirmModal/ConfirmModal";
import { Dropdown } from "@/app/uikit/overlays/Dropdown/Dropdown";
import { AvatarEdit } from "@/app/features/profile/info/AvatarEdit/AvatarEdit";
import { ProfileInfoModal } from "@/app/features/profile/modals/ProfileInfoModal/ProfileInfoModal";
import { AchievementsModal } from "@/app/features/profile/modals/AchievementsModal/AchievementsModal";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { useFriendRequestsStore } from "@/app/hooks/friends/useFriendRequestsStore";
import { useFriendRequestActions } from "@/app/hooks/friends/useFriendRequestActions";
import {
  addFriend as addFriendAPI,
  deleteFriend,
} from "@/services/api/friends";
import { revalidateFollows } from "@/services/actions/revalidateFollows";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/routes/routes";
import { getRelationshipStatus } from "@/utils/friends";
import { BannerInfo } from "@/types";
import styles from "./ProfileBanner.module.scss";

type RelationStatus =
  | "none"
  | "incoming"
  | "outgoing"
  | "friends"
  | "following";

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
  const [isDeleteFriendOpen, setIsDeleteFriendOpen] = useState(false);
  const [optimisticStatus, setOptimisticStatus] =
    useState<RelationStatus | null>(null);

  const hasMoreInfo = !!(
    bannerInfo.breed ||
    bannerInfo.birthDate ||
    bannerInfo.sex ||
    bannerInfo.bio ||
    (bannerInfo.followers && bannerInfo.followers.length > 0) ||
    (bannerInfo.interests && Object.values(bannerInfo.interests).some(Boolean))
  );

  const currentUser = useAuthStore((state) => state.currentUser);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const { isFriend, isPending, isFollowing } = getRelationshipStatus(
    currentUser,
    bannerInfo.id,
  );
  const isOwner = currentUser?.username === bannerInfo.username;
  const hasCurrentUser = !!currentUser;
  const requests = useFriendRequestsStore((state) => state.requests);
  const incomingRequest = requests.find(
    (request) => request.from.id === bannerInfo.id,
  );
  const { acceptRequest, rejectRequest } = useFriendRequestActions();

  let realStatus: RelationStatus = "none";
  if (isFriend) realStatus = "friends";
  else if (incomingRequest) realStatus = "incoming";
  else if (isPending) realStatus = "outgoing";
  else if (isFollowing) realStatus = "following";

  const status = optimisticStatus ?? realStatus;
  const isBusy = optimisticStatus !== null;

  useEffect(() => {
    if (hasCurrentUser && !isOwner) fetchCurrentUser();
  }, [bannerInfo.id, hasCurrentUser, isOwner, fetchCurrentUser]);

  const editProfile = () => {
    router.push(ROUTES.editProfile(bannerInfo.username));
  };

  const goToMessages = () => {
    if (!currentUser) return;
    router.push(ROUTES.messages(currentUser.username, bannerInfo.username));
  };

  const runAction = async (
    nextStatus: RelationStatus,
    action: () => Promise<void>,
  ) => {
    if (isBusy) return;
    setOptimisticStatus(nextStatus);
    try {
      await action();
    } catch {
      toast.error(t("toasts.error"));
    } finally {
      setOptimisticStatus(null);
    }
  };

  const addFriend = () => {
    const username = currentUser?.username;
    if (!username) return;
    runAction("outgoing", async () => {
      await addFriendAPI(username, bannerInfo.username);
      await revalidateFollows();
      await fetchCurrentUser();
    });
  };

  const removeRelation = () => {
    const username = currentUser?.username;
    if (!username) return;
    runAction("none", async () => {
      await deleteFriend(username, bannerInfo.username);
      await revalidateFollows();
      await fetchCurrentUser();
    });
  };

  const removeFriend = () => {
    setIsDeleteFriendOpen(false);
    removeRelation();
  };

  const acceptIncomingRequest = () => {
    if (!incomingRequest) return;
    runAction("friends", () => acceptRequest(incomingRequest));
  };

  const declineIncomingRequest = () => {
    if (!incomingRequest) return;
    runAction("none", () => rejectRequest(incomingRequest));
  };

  const stats = [
    {
      href: ROUTES.friends(bannerInfo.username),
      icon: <FaPaw size={18} />,
      label: t("profileBanner.friendsCount", { count: friendsCount }),
    },
    {
      href: ROUTES.photos(bannerInfo.username),
      icon: <PhotoIcon size={18} />,
      label: t("profileBanner.photosCount", { count: photosCount }),
    },
    {
      href: ROUTES.familyTree(bannerInfo.username),
      icon: <FaTree size={18} />,
      label: t("common.familyTree"),
    },
  ];

  const messageButton = (
    <Button appearance="secondary" onClick={goToMessages}>
      <FaMessage size={16} />
    </Button>
  );

  const renderActions = () => {
    if (isOwner) {
      return (
        <Button appearance="primary" onClick={editProfile}>
          {t("common.editProfile")}
        </Button>
      );
    }

    if (status === "friends") {
      return (
        <>
          <Dropdown
            triggerAppearance="button"
            trigger={<FaPaw size={16} />}
            label={t("common.friends")}
            align="left"
            items={[
              {
                label: t("profileBanner.removeFriend"),
                icon: <FaPaw size={16} />,
                onClick: () => setIsDeleteFriendOpen(true),
              },
            ]}
          />
          <Button appearance="primary" onClick={goToMessages}>
            {t("common.message")}
          </Button>
        </>
      );
    }

    if (status === "incoming") {
      return (
        <>
          {messageButton}
          <Button
            appearance="primary"
            className={styles.mainAction}
            onClick={acceptIncomingRequest}
            disabled={isBusy}
          >
            {t("profileBanner.acceptRequest")}
          </Button>
          <Button
            appearance="secondary"
            onClick={declineIncomingRequest}
            disabled={isBusy}
          >
            {t("friendRequest.decline")}
          </Button>
        </>
      );
    }

    if (status === "outgoing") {
      return (
        <>
          {messageButton}
          <Button
            appearance="secondary"
            title={t("profileBanner.cancelRequest")}
            onClick={removeRelation}
            disabled={isBusy}
          >
            {t("profileBanner.requestSent")}
          </Button>
        </>
      );
    }

    if (status === "following") {
      return (
        <>
          {messageButton}
          <Button appearance="secondary" className={styles.mainAction} disabled>
            {t("common.following")}
          </Button>
        </>
      );
    }

    return (
      <>
        {messageButton}
        <Button appearance="primary" onClick={addFriend} disabled={isBusy}>
          {t("common.addFriend")}
        </Button>
      </>
    );
  };

  return (
    <Card>
      <div className={styles.banner}>
        <div className={styles.avatarWrapper}>
          <AvatarEdit
            src={bannerInfo.avatar}
            name={bannerInfo.name}
            username={bannerInfo.username}
            size={140}
            avatarPhotos={bannerInfo.avatarPhotos}
            isEditable={isOwner}
          />
        </div>
        <div className={styles.container}>
          <div className={styles.info}>
            <div className={styles.nameWrapper}>
              <h1 className={styles.name}>{bannerInfo.name}</h1>
              <div className={styles.username}>@{bannerInfo.username}</div>
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
          <div className={styles.divider} />
          <div className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.href} className={styles.stat}>
                <Link href={stat.href} appearance="secondary">
                  {stat.icon}
                  <span>{stat.label}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.actions}>
          <Button
            appearance="secondary"
            onClick={() => setIsAchievementsOpen(true)}
          >
            <FaTrophy size={16} />
          </Button>
          {renderActions()}
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

        <ConfirmModal
          isOpen={isDeleteFriendOpen}
          title={t("friendCard.modalTitle")}
          description={t("friendCard.modalDescription", {
            name: bannerInfo.name,
          })}
          onConfirm={removeFriend}
          onClose={() => setIsDeleteFriendOpen(false)}
        />
      </div>
    </Card>
  );
};
