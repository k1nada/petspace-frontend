import cn from "classnames";
import { Logo } from "@/app/uikit/brand/Logo/Logo";
import { Skeleton } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { SKELETON_ICON } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import { SearchBar } from "@/app/uikit/navigation/SearchBar/SearchBar";
import { NotificationsTriggerSkeleton } from "@/app/uikit/overlays/NotificationsDropdown/NotificationsTriggerSkeleton";
import { DropdownSkeleton } from "@/app/uikit/overlays/Dropdown/DropdownSkeleton";
import styles from "./Header.module.scss";

export const HeaderSkeleton = () => (
  <header className={styles.header}>
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={cn(styles.icon, styles.menuToggle)}>
          <Skeleton
            shape="circle"
            width={SKELETON_ICON.navigation}
            height={SKELETON_ICON.navigation}
          />
        </div>
        <div className={styles.logo}>
          <Logo />
          <span className={styles.logoTitle}>Petspace</span>
        </div>
      </div>
      <div className={cn(styles.search, styles.desktopSearch)}>
        <Skeleton shape="rounded">
          <SearchBar />
        </Skeleton>
      </div>
      <nav className={styles.actions}>
        <div className={cn(styles.icon, styles.desktopIcon)}>
          <Skeleton
            shape="circle"
            width={SKELETON_ICON.navigation}
            height={SKELETON_ICON.navigation}
          />
        </div>
        <div className={cn(styles.icon, styles.desktopIcon)}>
          <Skeleton
            shape="circle"
            width={SKELETON_ICON.navigation}
            height={SKELETON_ICON.navigation}
          />
        </div>
        <div className={cn(styles.icon, styles.mobileSearchToggle)}>
          <Skeleton
            shape="circle"
            width={SKELETON_ICON.mobileSearch}
            height={SKELETON_ICON.mobileSearch}
          />
        </div>
        <NotificationsTriggerSkeleton />
        <span className={styles.mobileMenu}>
          <DropdownSkeleton iconSize={SKELETON_ICON.navigation} />
        </span>
        <div className={cn(styles.icon, styles.desktopIcon)}>
          <Skeleton
            shape="circle"
            width={SKELETON_ICON.navigation}
            height={SKELETON_ICON.navigation}
          />
        </div>
        <div className={cn(styles.icon, styles.desktopIcon)}>
          <Skeleton
            shape="circle"
            width={SKELETON_ICON.navigation}
            height={SKELETON_ICON.navigation}
          />
        </div>
      </nav>
    </div>
  </header>
);
