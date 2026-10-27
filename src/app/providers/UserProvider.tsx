"use client";

import { useEffect } from "react";
import { useAuthStore } from "../hooks/auth/useAuthStore";
import { useMessagesStore } from "../hooks/messages/useMessagesStore";
import { usePresenceSync } from "../hooks/shared/usePresenceSync";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/routes/routes";
import socket from "@/services/socket";
import { getConversations } from "@/services/api/conversations";
import { Message } from "@/types";
import { SOCKET_EVENTS, getRoomId } from "@/utils/chat";

const PUBLIC_ROUTES: string[] = [ROUTES.signin, ROUTES.signup];

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const currentUser = useAuthStore((state) => state.currentUser);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);
  const pathname = usePathname();
  const router = useRouter();

  usePresenceSync();

  useEffect(() => {
    fetchCurrentUser();

    const handleNewMessage = (message: Message) => {
      const user = useAuthStore.getState().currentUser;
      const activeRoomId = useMessagesStore.getState().activeRoomId;
      if (!user) return;
      if (message.sender?.id === user.id) return;
      if (message.roomId === activeRoomId) return;
      useMessagesStore.getState().incrementUnreadMessagesCount();
    };

    const handleReconnect = () => {
      const user = useAuthStore.getState().currentUser;
      if (!user) return;
      getConversations(user.username)
        .then((conversations) => {
          const activeRoomId = useMessagesStore.getState().activeRoomId;
          let totalUnread = 0;
          for (const conversation of conversations) {
            if (getRoomId(user.id, conversation.id) === activeRoomId) continue;
            totalUnread += conversation.unreadCount ?? 0;
          }
          useMessagesStore.getState().setUnreadMessagesCount(totalUnread);
        })
        .catch((error) => console.error(error));
    };

    socket.on(SOCKET_EVENTS.MESSAGE, handleNewMessage);
    socket.io.on("reconnect", handleReconnect);
    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE, handleNewMessage);
      socket.io.off("reconnect", handleReconnect);
    };
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (!isAuthChecked || currentUser) return;
    if (PUBLIC_ROUTES.includes(pathname)) return;
    router.push(ROUTES.signin);
  }, [isAuthChecked, currentUser, pathname, router]);

  return <>{children}</>;
};
