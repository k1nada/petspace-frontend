import { create } from "zustand";
import { FriendRequest } from "@/types";

interface FriendRequestsStore {
  requests: FriendRequest[];
  hasLoaded: boolean;
  setRequests: (requests: FriendRequest[]) => void;
  reset: () => void;
}

export const useFriendRequestsStore = create<FriendRequestsStore>((set) => ({
  requests: [],
  hasLoaded: false,

  setRequests: (requests) => set({ requests, hasLoaded: true }),
  reset: () => set({ requests: [], hasLoaded: false }),
}));
