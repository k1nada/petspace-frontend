import { create } from "zustand";
import { FriendRequest } from "@/types";

interface FriendRequestsStore {
  requests: FriendRequest[];
  setRequests: (requests: FriendRequest[]) => void;
  reset: () => void;
}

export const useFriendRequestsStore = create<FriendRequestsStore>((set) => ({
  requests: [],

  setRequests: (requests) => set({ requests }),
  reset: () => set({ requests: [] }),
}));
