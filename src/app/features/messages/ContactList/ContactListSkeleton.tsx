import { useTranslations } from "next-intl";
import { Skeleton, SkeletonText } from "@/app/uikit/feedback/Skeleton/Skeleton";
import { SKELETON_AVATAR } from "@/app/uikit/feedback/Skeleton/skeletonSizes";
import { Button } from "@/app/uikit/form/Button/Button";
import { SearchBar } from "@/app/uikit/navigation/SearchBar/SearchBar";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
import cardStyles from "../ContactCard/ContactCard.module.scss";
import styles from "./ContactList.module.scss";

const NAME_WIDTHS = ["55%", "40%", "65%", "50%", "45%"];

export const ContactListSkeleton = () => {
  const t = useTranslations();

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.header}>
          <CardTitle as="h1">
            <SkeletonText>{t("common.messages")}</SkeletonText>
          </CardTitle>
        </div>
        <Skeleton shape="rounded" width="100%">
          <SearchBar />
        </Skeleton>
      </div>
      <ul className={styles.list}>
        {NAME_WIDTHS.map((width, i) => (
          <li key={i} className={cardStyles.card}>
            <Button appearance="ghost">
              <Skeleton
                shape="circle"
                width={SKELETON_AVATAR.regular}
                height={SKELETON_AVATAR.regular}
              />
              <div className={cardStyles.info}>
                <span className={cardStyles.name}>
                  <SkeletonText width={width} />
                </span>
                <span className={cardStyles.text}>
                  <SkeletonText width="75%" />
                </span>
              </div>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
