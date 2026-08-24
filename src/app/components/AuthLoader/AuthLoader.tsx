"use client";

import { ReactNode } from "react";
import { useAuthStore } from "@/app/hooks/useAuthStore";

interface AuthLoaderProps {
  fallback: ReactNode;
  children: ReactNode;
}

export const AuthLoader = ({ fallback, children }: AuthLoaderProps) => {
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);

  if (!isAuthChecked) return <>{fallback}</>;

  return <>{children}</>;
};
