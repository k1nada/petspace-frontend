import { useState } from "react";
import { Friend } from "@/types";

interface UseFriendsListParams {
  friends: Friend[];
}

export const useFriendsList = ({
  friends: initialFriends,
}: UseFriendsListParams) => {
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState(initialFriends);

  const friendsList = friends.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
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
