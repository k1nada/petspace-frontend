"use client";

import { ReactNode } from "react";
import { useUserStore } from "@/app/hooks/useUserStore";

interface AuthLoaderProps {
  fallback: ReactNode;
  children: ReactNode;
}

export const AuthLoader = ({ fallback, children }: AuthLoaderProps) => {
  const isAuthChecked = useUserStore((state) => state.isAuthChecked);

  if (!isAuthChecked) return <>{fallback}</>;

  return <>{children}</>;
};
