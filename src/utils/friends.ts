import { User } from "@/types";

export interface RelationshipStatus {
  isFriend: boolean;
  isPending: boolean;
  isFollowing: boolean;
}

export const getRelationshipStatus = (
  currentUser: User | null | undefined,
  targetId?: string,
): RelationshipStatus => {
  if (!targetId)
    return { isFriend: false, isPending: false, isFollowing: false };

  const isFriend = !!currentUser?.friends?.some((f) => f.id === targetId);
  const isPending =
    !isFriend && !!currentUser?.sentRequests?.includes(targetId);
  const isFollowing =
    !isFriend && !isPending && !!currentUser?.following?.includes(targetId);

  return { isFriend, isPending, isFollowing };
};
