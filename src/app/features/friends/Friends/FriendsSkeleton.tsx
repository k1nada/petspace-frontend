import { useTranslations } from "next-intl";
import { Skeleton } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { Tab } from "@/app/uikit/navigation/Tab/Tab";
import { SearchBar } from "@/app/uikit/navigation/SearchBar/SearchBar";
import { Card } from "@/app/uikit/layout/Card/Card";
import { UserRowSkeleton } from "../UserRow/UserRowSkeleton";
import styles from "./Friends.module.scss";

const noop = () => {};

const NAME_WIDTHS = ["55%", "40%", "65%", "50%", "45%"];

export const FriendsSkeleton = () => {
  const t = useTranslations();
  const tabLabels = [
    t("common.friends"),
    t("friends.requestsTitle"),
    t("friends.followersTitle"),
    t("friends.followingTitle"),
  ];

  return (
    <Card as="section">
      <div className={styles.header}>
        <div className={styles.tabs}>
          {tabLabels.map((label, i) => (
            <Skeleton key={label}>
              <Tab label={label} count={0} isActive={i === 0} onClick={noop} />
            </Skeleton>
          ))}
        </div>
      </div>

      <Skeleton shape="rounded" width="100%">
        <SearchBar fullWidth />
      </Skeleton>
      <ul className={styles.list}>
        {NAME_WIDTHS.map((width, i) => (
          <UserRowSkeleton key={i} nameWidth={width} />
        ))}
      </ul>
    </Card>
  );
};
