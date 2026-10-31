"use client";

import { useRef } from "react";
import Image from "next/image";
import cn from "classnames";
import { useTranslations } from "next-intl";
import { Button } from "@/app/uikit/form/Button/Button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "./PhotoModalImage.module.scss";

const SWIPE_DISTANCE = 50;

interface PhotoModalImageProps {
  src: string;
  currentIndex?: number;
  photosCount?: number;
  onPrev?: () => void;
  onNext?: () => void;
}

export const PhotoModalImage = ({
  src,
  currentIndex,
  photosCount,
  onPrev,
  onNext,
}: PhotoModalImageProps) => {
  const t = useTranslations();
  const showNavigation = (photosCount ?? 0) > 1;
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !showNavigation) return;
    const distance = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (distance > SWIPE_DISTANCE) onPrev?.();
    if (distance < -SWIPE_DISTANCE) onNext?.();
  };

  return (
    <div
      className={styles.wrapper}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.background}>
        <Image
          src={src}
          alt=""
          fill
          unoptimized
          decoding="sync"
          className={styles.backgroundImage}
        />
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
          <FaChevronLeft size={18} />
        </Button>
      )}
      <div className={styles.foreground}>
        <Image
          src={src}
          alt={t("postCreator.photo")}
          fill
          unoptimized
          decoding="sync"
          className={styles.foregroundImage}
        />
      </div>
      {showNavigation && (
        <Button
          className={cn(styles.arrow, styles.arrowRight)}
          appearance="ghost"
          onClick={onNext}
        >
          <FaChevronRight size={18} />
        </Button>
      )}
    </div>
  );
};
