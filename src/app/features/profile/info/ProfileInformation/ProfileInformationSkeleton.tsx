import { SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { NavLinkSkeleton } from "@/app/uikit/navigation/NavLink/NavLinkSkeleton";
import styles from "./ProfileInformation.module.scss";

export const ProfileInformationSkeleton = () => (
  <nav className={styles.container}>
    <NavLinkSkeleton>
      <SkeletonText width={70} />
    </NavLinkSkeleton>
    <NavLinkSkeleton>
      <SkeletonText width={90} />
    </NavLinkSkeleton>
  </nav>
);
