import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useFriendRequestsStore } from "@/app/hooks/friends/useFriendRequestsStore";

export type FriendsTab = "friends" | "requests" | "followers" | "following";

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
  const activeTab = (searchParams.get("tab") as FriendsTab) || "friends";

  const requestsCount = useFriendRequestsStore((state) => state.requestCount);

  const goToTab = (tab: FriendsTab) => router.push(`?tab=${tab}`);

  const friendsLabel = isMyProfile
    ? t("common.friends")
    : t("friends.friendsTitleOther", { name });

  const tabs = [
    { key: "friends", label: friendsLabel, count: friendsCount },
    {
      key: "requests",
      label: t("friends.requestsTitle"),
      count: requestsCount,
      hidden: !isMyProfile,
    },
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
  ] satisfies {
    key: FriendsTab;
    label: string;
    count: number;
    hidden?: boolean;
  }[];

  return { activeTab, goToTab, tabs };
};
