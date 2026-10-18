import Image from "next/image";
import logoImage from "@/assets/logo.svg";
import styles from "./Logo.module.scss";

export const Logo = () => {
  return (
    <Image
      src={logoImage}
      width={40}
      height={40}
      alt=""
      className={styles.logo}
      priority
    />
  );
};
