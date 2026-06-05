"use client";

import { useEffect } from "react";
import { useUserStore } from "../hooks/useUserStore";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const fetchCurrentUser = useUserStore((state) => state.fetchCurrentUser);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return <>{children}</>;
};
