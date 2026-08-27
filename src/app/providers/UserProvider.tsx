"use client";

import { useEffect } from "react";
import { useAuthStore } from "../hooks/auth/useAuthStore";
import { useMessagesStore } from "../hooks/messages/useMessagesStore";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/routes/routes";
import socket from "@/services/socket";
import { Message } from "@/types";

const PUBLIC_ROUTES: string[] = [ROUTES.signin, ROUTES.signup];

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const currentUser = useAuthStore((state) => state.currentUser);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetchCurrentUser();

    const handleNewMessage = (message: Message) => {
      const currentUser = useAuthStore.getState().currentUser;
      const activeRoomId = useMessagesStore.getState().activeRoomId;
      if (!currentUser) return;
      if (message.roomId === activeRoomId) return;
      useMessagesStore.getState().incrementUnreadMessagesCount();
    };

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);

  useEffect(() => {
    if (!isAuthChecked || currentUser) return;
    if (PUBLIC_ROUTES.includes(pathname)) return;
    router.push(ROUTES.signin);
  }, [isAuthChecked, currentUser, pathname, router]);

  return <>{children}</>;
};
