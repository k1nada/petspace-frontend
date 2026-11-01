"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { PiDogFill } from "react-icons/pi";
import styles from "./Avatar.module.scss";

interface AvatarProps {
  src?: string;
  size?: number;
  isOnline?: boolean;
}

export const Avatar = ({ src, size = 45, isOnline }: AvatarProps) => {
  const t = useTranslations();

  return (
    <div
      className={styles.avatar}
      style={
        {
          width: size,
          height: size,
          "--avatar-size": `${size}px`,
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
