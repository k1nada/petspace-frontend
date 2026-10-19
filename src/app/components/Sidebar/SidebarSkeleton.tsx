import { useTranslations } from "next-intl";
import { Skeleton, SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { SKELETON_ICON } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import { TipSkeleton } from "@/app/uikit/feedback/Tip/TipSkeleton";
import { NavLinkSkeleton } from "@/app/uikit/navigation/NavLink/NavLinkSkeleton";
import styles from "./Sidebar.module.scss";

const LABEL_WIDTHS = ["90%", "80%", "95%", "75%", "85%", "90%"];

export const SidebarSkeleton = () => {
  const t = useTranslations();
  const tips = t.raw("dailyTip.tips") as string[];

  return (
    <nav className={styles.container}>
      <div className={styles.list}>
        {LABEL_WIDTHS.map((width, i) => (
          <NavLinkSkeleton key={i}>
            <Skeleton
              shape="circle"
              width={SKELETON_ICON.navigation}
              height={SKELETON_ICON.navigation}
            />
            <span className={styles.skeletonLabel}>
              <SkeletonText width={width} />
            </span>
          </NavLinkSkeleton>
        ))}
      </div>
      <TipSkeleton
        title={t("dailyTip.title")}
        text={tips[new Date().getDay()]}
      />
    </nav>
  );
};
