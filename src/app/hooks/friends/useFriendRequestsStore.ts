import { create } from "zustand";
import { FriendRequest } from "@/types";

interface FriendRequestsStore {
  requestCount: number;
  requests: FriendRequest[];
  setRequestCount: (count: number) => void;
  setRequests: (requests: FriendRequest[]) => void;
  reset: () => void;
}

export const useFriendRequestsStore = create<FriendRequestsStore>((set) => ({
  requestCount: 0,
  requests: [],

  setRequestCount: (count) => set({ requestCount: count }),
  setRequests: (requests) => set({ requests, requestCount: requests.length }),
  reset: () => set({ requestCount: 0, requests: [] }),
}));
