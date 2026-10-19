"use client";

import { useLayoutEffect } from "react";

export const ThemeSync = () => {
  useLayoutEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      const theme = saved ? JSON.parse(saved).state?.theme : "light";
      document.documentElement.setAttribute("data-theme", theme || "light");
    } catch {}
  }, []);

  return null;
};
