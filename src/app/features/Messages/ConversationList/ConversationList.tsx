"use client";

import { useTranslations } from "next-intl";
import styles from "./ConversationList.module.scss";
import { SearchBar } from "@/app/uikit/navigation/SearchBar/SearchBar";
import { Button } from "@/app/uikit/form/Button/Button";
import { ROUTES } from "@/routes/routes";
import { useRouter } from "next/navigation";
import { DropdownMenu } from "@/app/uikit/overlays/DropdownMenu/DropdownMenu";
import { GiBeachBall } from "react-icons/gi";
import { Friend, User } from "@/types";
import { ConversationCard } from "../ConversationCard/ConversationCard";

interface ConversationListProps {
  friends: Friend[];
  user: User;
  onSelectFriend: (friend: Friend) => void;
}

export const ConversationList = ({
  friends = [],
  user,
  onSelectFriend,
}: ConversationListProps) => {
  const t = useTranslations();
  const router = useRouter();

  const findFriends = () => {
    router.push(ROUTES.friends(user.username));
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t("conversationList.title")}</h1>
          <div className={styles.dropdown}>
            <DropdownMenu
              items={[
                {
                  label: "Create a group",
                  icon: <GiBeachBall size={20} />,
                  onClick: () => {},
                },
              ]}
            />
          </div>
        </div>
        <SearchBar />
      </div>
      <ul className={styles.list}>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <ConversationCard
              key={friend.username}
              friend={friend}
              onClick={() => onSelectFriend(friend)}
            />
          ))
        ) : (
          <div className={styles.emptyMessages}>
            <p className={styles.emptyText}>
              {t("conversationList.emptyTitle")}
              <br />
              {t("conversationList.emptyText")}
            </p>
            <Button appearance="primary" onClick={findFriends}>
              {t("conversationList.findFriends")}
            </Button>
          </div>
        )}
      </ul>
    </div>
  );
};
