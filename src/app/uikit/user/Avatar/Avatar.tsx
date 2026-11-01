"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { PiDogFill } from "react-icons/pi";
import styles from "./Avatar.module.scss";

interface AvatarProps {
  src?: string;
  size?: number;
  mobileSize?: number;
  isOnline?: boolean;
}

export const Avatar = ({
  src,
  size = 45,
  mobileSize,
  isOnline,
}: AvatarProps) => {
  const t = useTranslations();
  const phoneSize = mobileSize ?? size;

  return (
    <div
      className={styles.avatar}
      style={
        {
          "--avatar-base-size": `${size}px`,
          "--avatar-mobile-size": `${phoneSize}px`,
        } as React.CSSProperties
      }
    >
      {src ? (
        <Image
          src={src}
          fill
          alt={t("common.avatar")}
          className={styles.image}
          sizes={`${size}px`}
          unoptimized
        />
      ) : (
        <div className={styles.placeholder}>
          <PiDogFill />
        </div>
      )}
      {isOnline && <span className={styles.online} />}
    </div>
  );
};
