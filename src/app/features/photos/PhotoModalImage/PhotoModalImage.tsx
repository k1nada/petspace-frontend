import Image from "next/image";
import cn from "classnames";
import { useTranslations } from "next-intl";
import { Button } from "@/app/uikit/form/Button/Button";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Photo } from "@/types";
import { getPhotoUrl } from "@/utils/photo";
import styles from "./PhotoModalImage.module.scss";

interface PhotoModalImageProps {
  photo: Photo;
  imageUrl?: string;
  currentIndex?: number;
  photosCount?: number;
  onPrev?: () => void;
  onNext?: () => void;
}

export const PhotoModalImage = ({
  photo,
  imageUrl,
  currentIndex,
  photosCount,
  onPrev,
  onNext,
}: PhotoModalImageProps) => {
  const t = useTranslations();
  const showNavigation = (photosCount ?? 0) > 1;
  const src = imageUrl ?? getPhotoUrl(photo);

  return (
    <div className={styles.wrapper}>
      <div className={styles.background}>
        <Image src={src} alt="" fill className={styles.backgroundImage} />
      </div>
      {showNavigation && (
        <span className={styles.counter}>
          {t("photoModal.counter", {
            current: (currentIndex ?? 0) + 1,
            total: photosCount ?? 0,
          })}
        </span>
      )}
      {showNavigation && (
        <Button
          className={cn(styles.arrow, styles.arrowLeft)}
          appearance="ghost"
          onClick={onPrev}
        >
          <FaAngleLeft size={30} />
        </Button>
      )}
      <div className={styles.foreground}>
        <Image
          src={src}
          alt={t("postCreator.photo")}
          fill
          className={styles.foregroundImage}
        />
      </div>
      {showNavigation && (
        <Button
          className={cn(styles.arrow, styles.arrowRight)}
          appearance="ghost"
          onClick={onNext}
        >
          <FaAngleRight size={30} />
        </Button>
      )}
    </div>
  );
};
