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

export const useSuggestedFriends = (currentUser: User | null) => {
  const t = useTranslations();
  const suggestions = useSuggestedFriendsStore((state) => state.suggestions);
  const hasLoaded = useSuggestedFriendsStore((state) => state.hasLoaded);
  const setSuggestions = useSuggestedFriendsStore(
    (state) => state.setSuggestions,
  );
  const [requestedIds, setRequestedIds] = useState<string[]>([]);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const loading = !hasLoaded && !(isAuthChecked && !currentUser);

  const currentUsername = currentUser?.username;

  useEffect(() => {
    if (!currentUsername || hasLoaded) return;

    getSuggestedFriends(currentUsername)
      .then((users) => {
        setSuggestions(
          [...users]
            .sort(() => Math.random() - 0.5)
            .slice(0, SUGGESTIONS_COUNT),
        );
      })
      .catch(() => setSuggestions([]));
  }, [currentUsername, hasLoaded, setSuggestions]);

  const requestFriend = async (username: string) => {
    if (!currentUser) return;
    try {
      await addFriend(currentUser.username, username);
      await revalidateFollows();
      setRequestedIds((prev) => [...prev, username]);
      await fetchCurrentUser();
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const cancelRequest = async (username: string) => {
    if (!currentUser) return;
    try {
      await deleteFriend(currentUser.username, username);
      await revalidateFollows();
      setRequestedIds((prev) => prev.filter((id) => id !== username));
      await fetchCurrentUser();
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  return { suggestions, requestedIds, loading, requestFriend, cancelRequest };
};
