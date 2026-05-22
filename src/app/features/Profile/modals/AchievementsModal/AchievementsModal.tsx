import styles from "./AchievementsModal.module.scss";
import { useTranslations } from "next-intl";
import { FaDog, FaLock } from "react-icons/fa";
import { BiSolidBone } from "react-icons/bi";
import { ACHIEVEMENT_KEYS } from "@/app/uikit/constants/achievements";
import { Modal } from "@/app/uikit/overlays/Modal/Modal";
import { Achievements } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  achievements?: Achievements;
}

export const AchievementsModal = ({ isOpen, onClose, achievements }: Props) => {
  const t = useTranslations();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t("achievements.title")}</h2>
        <div className={styles.list}>
          {ACHIEVEMENT_KEYS.map((key) => {
            const unlocked = achievements?.[key];
            return (
              <div
                key={key}
                className={`${styles.item} ${unlocked ? styles.unlocked : styles.locked}`}
              >
                {unlocked ? <FaDog size={25} /> : <FaLock size={25} />}
                <div className={styles.content}>
                  <div className={styles.contentTitle}>
                    {t(`achievements.${key}`)}
                  </div>
                  <div className={styles.text}>
                    {t(`achievements.${key}Text`)}
                  </div>
                </div>
                {unlocked && <BiSolidBone size={18} className={styles.bone} />}
              </div>
            );
          })}
        </div>
        <div className={styles.footer}>
          <div>{t("achievements.totalBones")}</div>
          <div className={styles.total}>
            <BiSolidBone size={18} />
            {ACHIEVEMENT_KEYS.filter((key) => achievements?.[key]).length}
          </div>
        </div>
      </div>
    </Modal>
  );
};
