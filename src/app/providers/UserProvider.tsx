"use client";

import { useEffect } from "react";
import { useAuthStore } from "../hooks/useAuthStore";
import { useMessagesStore } from "../hooks/useMessagesStore";
import socket from "@/services/socket";
import { Message } from "@/types";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);

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

  return <>{children}</>;
};
