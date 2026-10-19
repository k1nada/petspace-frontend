import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import {
  getSuggestedFriends,
  addFriend,
  deleteFriend,
} from "@/services/api/friends";
import { User } from "@/types";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { useSuggestedFriendsStore } from "@/app/hooks/friends/useSuggestedFriendsStore";
import { revalidateFollows } from "@/services/actions/revalidateFollows";

const SUGGESTIONS_COUNT = 3;

export const loadSuggestions = async (username: string): Promise<User[]> => {
  const users = await getSuggestedFriends(username);
  return [...users].sort(() => Math.random() - 0.5).slice(0, SUGGESTIONS_COUNT);
};

export const useLoadSuggestedFriends = (
  currentUsername: string | undefined,
) => {
  const hasLoaded = useSuggestedFriendsStore((state) => state.hasLoaded);
  const setSuggestions = useSuggestedFriendsStore(
    (state) => state.setSuggestions,
  );

  useEffect(() => {
    if (!currentUsername || hasLoaded) return;
    let cancelled = false;

    loadSuggestions(currentUsername)
      .then((users) => {
        if (!cancelled) setSuggestions(users);
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      });

    return () => {
      cancelled = true;
    };
  }, [currentUsername, hasLoaded, setSuggestions]);
};

export const useSuggestedFriends = (currentUser: User | null) => {
  const t = useTranslations();
  const suggestions = useSuggestedFriendsStore((state) => state.suggestions);
  const [loadingUsername, setLoadingUsername] = useState<string | null>(null);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);

  useLoadSuggestedFriends(currentUser?.username);

  const requestFriend = async (username: string) => {
    if (!currentUser || loadingUsername) return;
    setLoadingUsername(username);
    try {
      await addFriend(currentUser.username, username);
      await revalidateFollows();
      await fetchCurrentUser();
    } catch {
      toast.error(t("toasts.error"));
    } finally {
      setLoadingUsername(null);
    }
  };

  const cancelRequest = async (username: string) => {
    if (!currentUser || loadingUsername) return;
    setLoadingUsername(username);
    try {
      await deleteFriend(currentUser.username, username);
      await revalidateFollows();
      await fetchCurrentUser();
    } catch {
      toast.error(t("toasts.error"));
    } finally {
      setLoadingUsername(null);
    }
  };

  return {
    suggestions,
    loadingUsername,
    requestFriend,
    cancelRequest,
  };
};
