"use client";

import { useLayoutEffect } from "react";
import { useThemeStore } from "../../../hooks/shared/useThemeStore";
import { Button } from "../../form/Button/Button";
import { FaMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa6";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useThemeStore();
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <Button appearance="ghost" onClick={toggle} className={className}>
      {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} />}
    </Button>
  );
}
