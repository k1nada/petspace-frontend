"use client";

import Image, { StaticImageData } from "next/image";
import styles from "./Avatar.module.scss";
import defaultAvatar from "@/public/avatars/default.png";

interface AvatarProps {
  src?: string | StaticImageData;
  size?: number;
  isOnline?: boolean;
}

export const Avatar = ({ src, size = 45, isOnline }: AvatarProps) => {
  return (
    <div 
      className={styles.avatar} 
      style={{ 
        width: size,
        height: size,
        '--avatar-size': `${size}px`
      } as React.CSSProperties}
    >
      <Image
        src={src ?? defaultAvatar}
        fill
        alt="Avatar"
        className={styles.image}
        sizes={`${size}px`}
      />
      {isOnline && <span className={styles.online} />}
    </div>
  );
};