import { create } from "zustand";

interface MobileMenuStore {
  isOpen: boolean;
  close: () => void;
  toggle: () => void;
}

export const useMobileMenuStore = create<MobileMenuStore>((set) => ({
  isOpen: false,
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
