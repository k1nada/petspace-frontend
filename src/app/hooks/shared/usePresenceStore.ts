import { create } from "zustand";

export interface UserPresence {
  isOnline: boolean;
  lastSeen?: string;
}

export interface UserWithPresence {
  id?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

interface PresenceStore {
  presenceByUserId: Record<string, UserPresence>;
  setPresence: (userId: string, presence: UserPresence) => void;
  setPresenceFromUsers: (users: UserWithPresence[]) => void;
  reset: () => void;
}

export const usePresenceStore = create<PresenceStore>((set) => ({
  presenceByUserId: {},

  setPresence: (userId, presence) =>
    set((state) => ({
      presenceByUserId: { ...state.presenceByUserId, [userId]: presence },
    })),

  setPresenceFromUsers: (users) =>
    set((state) => {
      const presenceByUserId = { ...state.presenceByUserId };
      for (const user of users) {
        if (!user.id) continue;
        presenceByUserId[user.id] = {
          isOnline: user.isOnline ?? false,
          lastSeen: user.lastSeen,
        };
      }
      return { presenceByUserId };
    }),

  reset: () => set({ presenceByUserId: {} }),
}));
