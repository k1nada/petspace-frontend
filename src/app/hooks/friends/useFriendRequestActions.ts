import {
  acceptFriendRequest,
  rejectFriendRequest,
} from "@/services/api/friends";
import { revalidateFollows } from "@/services/actions/revalidateFollows";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { useFriendRequestsStore } from "@/app/hooks/friends/useFriendRequestsStore";
import { useSuggestedFriendsStore } from "@/app/hooks/friends/useSuggestedFriendsStore";
import { FriendRequest } from "@/types";

export const useFriendRequestActions = () => {
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);

  const respond = async (request: FriendRequest, isAccept: boolean) => {
    const requestsStore = useFriendRequestsStore.getState();
    requestsStore.setRequests(
      requestsStore.requests.filter((item) => item.id !== request.id),
    );

    try {
      if (isAccept) {
        await acceptFriendRequest(request.id);
      } else {
        await rejectFriendRequest(request.id);
      }
    } catch (error) {
      const current = useFriendRequestsStore.getState().requests;
      useFriendRequestsStore.getState().setRequests([...current, request]);
      throw error;
    }

    if (isAccept) {
      const suggestionsStore = useSuggestedFriendsStore.getState();
      suggestionsStore.setSuggestions(
        suggestionsStore.suggestions.filter(
          (user) => user.id !== request.from.id,
        ),
      );
    }

    await revalidateFollows();
    await fetchCurrentUser();
  };

  const acceptRequest = (request: FriendRequest) => respond(request, true);
  const rejectRequest = (request: FriendRequest) => respond(request, false);

  return { acceptRequest, rejectRequest };
};
