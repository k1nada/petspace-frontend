import { useEffect, useState } from "react";
import { Friend } from "@/types";
import { usePresenceStore } from "@/app/hooks/shared/usePresenceStore";

interface UseFriendsListParams {
  friends: Friend[];
}

export const useFriendsList = ({
  friends: initialFriends,
}: UseFriendsListParams) => {
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState(initialFriends);
  useEffect(() => {
    const store = usePresenceStore.getState();
    for (const friend of initialFriends) {
      if (store.presenceByUserId[friend.id]) continue;
      store.setPresence(friend.id, {
        isOnline: friend.isOnline ?? false,
        lastSeen: friend.lastSeen,
      });
    }
  }, [initialFriends]);

  const friendsList = friends.filter((f) =>
    (f.name || f.username).toLowerCase().includes(search.toLowerCase()),
  );

  const deleteFriend = (friendUsername: string) =>
    setFriends((prev) => prev.filter((f) => f.username !== friendUsername));

  return {
    search,
    setSearch,
    friendsCount: friends.length,
    hasFriends: friends.length > 0,
    friendsList,
    deleteFriend,
  };
};
