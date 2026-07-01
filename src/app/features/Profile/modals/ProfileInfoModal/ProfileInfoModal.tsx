import { Modal } from "@/app/uikit/overlays/Modal/Modal";
import styles from "./ProfileInfoModal.module.scss";
import {
  FaBirthdayCake,
  FaMars,
  FaPaw,
  FaVenus,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useTranslations, useLocale } from "next-intl";
import "dayjs/locale/pl";
import "dayjs/locale/en";
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
  const { bio, breed, city, gender, birthDate, interests } = user;
  const hasInterests = interests && Object.values(interests).some(Boolean);

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

          {gender === "female" && (
            <div className={styles.row}>
              <FaVenus size={16} className={styles.icon} />
              <span>{t("gender.female")}</span>
            </div>
          )}

          {gender === "male" && (
            <div className={styles.row}>
              <FaMars size={16} className={styles.icon} />
              <span>{t("gender.male")}</span>
            </div>
          )}

          {birthDate && (
            <div className={styles.row}>
              <FaBirthdayCake size={16} className={styles.icon} />
              <span>{formatDate(birthDate, locale)}</span>
            </div>
          )}

          {hasInterests && (
            <>
              <div className={styles.interests}>
                <h3 className={styles.interestsTitle}>
                  {t("profileInfoModal.interestsTitle")}
                </h3>
                {interests.favoriteToys && (
                  <div className={styles.interestItem}>
                    <div className={styles.interestLabel}>
                      {t("profileInterests.toys")}
                    </div>
                    <div className={styles.interestValue}>
                      {interests.favoriteToys}
                    </div>
                  </div>
                )}
                {interests.favoriteTreats && (
                  <div className={styles.interestItem}>
                    <div className={styles.interestLabel}>
                      {t("profileInterests.treats")}
                    </div>
                    <div className={styles.interestValue}>
                      {interests.favoriteTreats}
                    </div>
                  </div>
                )}
                {interests.favoriteActivities && (
                  <div className={styles.interestItem}>
                    <div className={styles.interestLabel}>
                      {t("profileInterests.activities")}
                    </div>
                    <div className={styles.interestValue}>
                      {interests.favoriteActivities}
                    </div>
                  </div>
                )}
                {interests.crimes && (
                  <div className={styles.interestItem}>
                    <div className={styles.interestLabel}>
                      {t("profileInterests.crimes")}
                    </div>
                    <div className={styles.interestValue}>
                      {interests.crimes}
                    </div>
                  </div>
                )}
                {interests.guiltyHabits && (
                  <div className={styles.interestItem}>
                    <div className={styles.interestLabel}>
                      {t("profileInterests.habits")}
                    </div>
                    <div className={styles.interestValue}>
                      {interests.guiltyHabits}
                    </div>
                  </div>
                )}
                {interests.humans && (
                  <div className={styles.interestItem}>
                    <div className={styles.interestLabel}>
                      {t("profileInterests.humans")}
                    </div>
                    <div className={styles.interestValue}>
                      {interests.humans}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
