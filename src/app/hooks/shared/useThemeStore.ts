import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  toggle: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggle: () => {
        const nextTheme = get().theme === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", nextTheme);
        set({ theme: nextTheme });
      },
    }),
    { name: "theme" },
  ),
);
