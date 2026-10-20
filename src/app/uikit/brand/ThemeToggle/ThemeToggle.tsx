"use client";

import { useThemeStore } from "@/app/hooks/shared/useThemeStore";
import { Button } from "../../form/Button/Button";
import { FaMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa6";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useThemeStore((state) => state.theme);
  const toggle = useThemeStore((state) => state.toggle);

  return (
    <Button appearance="ghost" onClick={toggle} className={className}>
      {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} />}
    </Button>
  );
}
