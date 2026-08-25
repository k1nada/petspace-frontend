import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useFriendRequestsStore } from "@/app/hooks/useFriendRequestsStore";

export type FriendsTab = "friends" | "requests" | "followers" | "following";

interface UseFriendsTabParams {
  isMyProfile: boolean;
  friendsCount: number;
  followersCount: number;
  followingCount: number;
}

export const useFriendsTab = ({
  isMyProfile,
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

  const tabs = [
    { key: "friends", label: t("common.friends"), count: friendsCount },
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
    },
    {
      key: "following",
      label: t("friends.followingTitle"),
      count: followingCount,
    },
  ] satisfies {
    key: FriendsTab;
    label: string;
    count: number;
    hidden?: boolean;
  }[];

  return { activeTab, goToTab, tabs };
};
