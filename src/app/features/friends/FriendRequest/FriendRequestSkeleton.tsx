import { useTranslations } from "next-intl";
import { SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { Card } from "@/app/uikit/layout/Card/Card";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
import { FriendRequestCardSkeleton } from "../FriendRequestCard/FriendRequestCardSkeleton";
import styles from "./FriendRequest.module.scss";

const NAME_WIDTHS = ["55%", "40%", "65%"];

export const FriendRequestSkeleton = () => {
  const t = useTranslations();

  return (
    <Card as="section">
      <CardTitle>
        <SkeletonText>{t("friendRequest.blockTitle")}</SkeletonText>
      </CardTitle>
      <ul className={styles.list}>
        {NAME_WIDTHS.map((width, i) => (
          <FriendRequestCardSkeleton key={i} nameWidth={width} />
        ))}
      </ul>
    </Card>
  );
};
