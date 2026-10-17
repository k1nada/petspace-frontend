import { create } from "zustand";
import { FriendRequest } from "@/types";

interface FriendRequestsStore {
  requestCount: number;
  requests: FriendRequest[];
  setRequests: (requests: FriendRequest[]) => void;
  reset: () => void;
}

export const useFriendRequestsStore = create<FriendRequestsStore>((set) => ({
  requestCount: 0,
  requests: [],

  setRequests: (requests) => set({ requests, requestCount: requests.length }),
  reset: () => set({ requestCount: 0, requests: [] }),
}));
