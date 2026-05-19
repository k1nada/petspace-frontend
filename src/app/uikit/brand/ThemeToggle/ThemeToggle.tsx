"use client";

import { useThemeStore } from "../../../hooks/useThemeStore";
import { Button } from "../../form/Button/Button";
import { FaMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa6";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useThemeStore();

  return (
    <Button appearance="ghost" onClick={toggle} className={className}>
      {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} />}
    </Button>
  );
}
