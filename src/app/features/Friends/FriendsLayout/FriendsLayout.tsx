import { useTranslations } from "next-intl";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import styles from "./FriendsLayout.module.scss";
import { Friends } from "../Friends/Friends";
import { FriendRequest } from "../FriendRequest/FriendRequest";
import { Friend } from "@/types";
import { Tip } from "@/app/uikit/feedback/Tip/Tip";

interface FriendsLayoutProps {
  username: string;
  friends?: Friend[];
}

export const FriendsLayout = ({ username, friends }: FriendsLayoutProps) => {
  const t = useTranslations();

  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Sidebar username={username} />
      </div>
      <div className={styles.content}>
        <Friends friends={friends} />
      </div>
      <div className={styles.rightColumn}>
        <FriendRequest friends={friends} />
        <Tip
          title={t("friendTip.title")}
          text={t("friendTip.text")}
          appearance="secondary"
        />
      </div>
    </div>
  );
};