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
        const html = document.documentElement;
        html.classList.add("theme-switching");
        html.setAttribute("data-theme", nextTheme);
        set({ theme: nextTheme });
        requestAnimationFrame(() =>
          requestAnimationFrame(() => html.classList.remove("theme-switching")),
        );
      },
    }),
    { name: "theme" },
  ),
);
