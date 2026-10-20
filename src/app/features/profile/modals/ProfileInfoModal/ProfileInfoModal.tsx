"use client";

import { Modal } from "@/app/uikit/overlays/Modal/Modal";
import styles from "./ProfileInfoModal.module.scss";
import {
  FaBirthdayCake,
  FaMars,
  FaPaw,
  FaVenus,
  FaMapMarkerAlt,
  FaDog,
} from "react-icons/fa";
import { useTranslations, useLocale } from "next-intl";
import { BannerInfo } from "@/types";
import { formatDate } from "@/utils/dateFormatters";

interface ProfileInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: BannerInfo;
}

export const ProfileInfoModal = ({
  isOpen,
  onClose,
  user,
}: ProfileInfoModalProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const { bio, breed, city, sex, birthDate, interests, followers } = user;
  const hasInterests = interests && Object.values(interests).some(Boolean);
  const followersCount = followers?.length ?? 0;

  const interestItems = [
    { label: t("profileInterests.toys"), value: interests?.favoriteToys },
    { label: t("profileInterests.treats"), value: interests?.favoriteTreats },
    {
      label: t("profileInterests.activities"),
      value: interests?.favoriteActivities,
    },
    { label: t("profileInterests.crimes"), value: interests?.crimes },
    { label: t("profileInterests.habits"), value: interests?.guiltyHabits },
    { label: t("profileInterests.humans"), value: interests?.humans },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t("profileInfoModal.title")}</h2>
        <div className={styles.rows}>
          {bio && <div className={styles.bio}>{bio}</div>}
          {breed && (
            <div className={styles.row}>
              <FaPaw size={16} className={styles.icon} />
              <span>{breed}</span>
            </div>
          )}

          {city && (
            <div className={styles.row}>
              <FaMapMarkerAlt size={16} className={styles.icon} />
              <span>{city}</span>
            </div>
          )}

          {followersCount > 0 && (
            <div className={styles.row}>
              <FaDog size={16} className={styles.icon} />
              <span>
                {t("profileInfoModal.followersCount", {
                  count: followersCount,
                })}
              </span>
            </div>
          )}

          {sex === "female" && (
            <div className={styles.row}>
              <FaVenus size={16} className={styles.icon} />
              <span>{t("sex.female")}</span>
            </div>
          )}

          {sex === "male" && (
            <div className={styles.row}>
              <FaMars size={16} className={styles.icon} />
              <span>{t("sex.male")}</span>
            </div>
          )}

          {birthDate && (
            <div className={styles.row}>
              <FaBirthdayCake size={16} className={styles.icon} />
              <span>{formatDate(birthDate, locale)}</span>
            </div>
          )}

          {hasInterests && (
            <div className={styles.interests}>
              <h3 className={styles.interestsTitle}>
                {t("profileInfoModal.interestsTitle")}
              </h3>
              {interestItems
                .filter((item) => item.value)
                .map((item) => (
                  <div key={item.label} className={styles.interestItem}>
                    <div className={styles.interestLabel}>{item.label}</div>
                    <div className={styles.interestValue}>{item.value}</div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
