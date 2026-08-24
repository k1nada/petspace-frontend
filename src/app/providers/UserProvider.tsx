"use client";

import { useEffect } from "react";
import { useAuthStore } from "../hooks/useAuthStore";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return <>{children}</>;
};
