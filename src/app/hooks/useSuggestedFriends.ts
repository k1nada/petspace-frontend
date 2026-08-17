import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { getSuggestedFriends, addFriend } from "@/app/api/friends";
import { User } from "@/types";
import { useUserStore } from "@/app/hooks/useUserStore";
import { withMinDelay } from "@/utils/withMinDelay";

const SKELETON_MIN_DELAY_MS = 200;

const SUGGESTIONS_COUNT = 3;

export const useSuggestedFriends = (currentUser: User | null) => {
  const t = useTranslations();
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [requestedIds, setRequestedIds] = useState<string[]>([]);
  const [loadingState, setLoadingState] = useState(true);
  const isAuthChecked = useUserStore((state) => state.isAuthChecked);
  const loading = loadingState && !(isAuthChecked && !currentUser);

  useEffect(() => {
    if (!currentUser) return;

    withMinDelay(
      getSuggestedFriends(currentUser.username),
      SKELETON_MIN_DELAY_MS,
    ).then((users) => {
      setSuggestions(
        [...users].sort(() => Math.random() - 0.5).slice(0, SUGGESTIONS_COUNT),
      );
      setLoadingState(false);
    });
  }, [currentUser]);

  const requestFriend = async (username: string) => {
    if (!currentUser) return;
    try {
      await addFriend(currentUser.username, username);
      setRequestedIds((prev) => [...prev, username]);
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  return { suggestions, requestedIds, loading, requestFriend };
};
