"use client";

import { useLayoutEffect } from "react";
import { useThemeStore } from "../../../hooks/useThemeStore";
import { Button } from "../../form/Button/Button";
import { FaMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa6";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useThemeStore();

  // Keeps <html data-theme> in sync with the store, including after a
  // locale switch remounts the root layout and wipes the attribute.
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <Button appearance="ghost" onClick={toggle} className={className}>
      {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} />}
    </Button>
  );
}
