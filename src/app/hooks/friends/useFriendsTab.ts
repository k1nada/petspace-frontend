import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

type FriendsTab = "friends" | "followers" | "following";

const FRIENDS_TABS: FriendsTab[] = ["friends", "followers", "following"];

interface FriendsTabItem {
  key: FriendsTab;
  label: string;
  count: number;
  hidden?: boolean;
}

interface UseFriendsTabParams {
  isMyProfile: boolean;
  name: string;
  friendsCount: number;
  followersCount: number;
  followingCount: number;
}

export const useFriendsTab = ({
  isMyProfile,
  name,
  friendsCount,
  followersCount,
  followingCount,
}: UseFriendsTabParams) => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = FRIENDS_TABS.find((tab) => tab === tabParam) ?? "friends";

  const goToTab = (tab: FriendsTab) => router.push(`?tab=${tab}`);

  const friendsLabel = isMyProfile
    ? t("common.friends")
    : t("friends.friendsTitleOther", { name });

  const tabs: FriendsTabItem[] = [
    { key: "friends", label: friendsLabel, count: friendsCount },
    {
      key: "followers",
      label: t("friends.followersTitle"),
      count: followersCount,
      hidden: !isMyProfile,
    },
    {
      key: "following",
      label: t("friends.followingTitle"),
      count: followingCount,
      hidden: !isMyProfile,
    },
  ];

  return { activeTab, goToTab, tabs };
};
