import { useEffect } from "react";
import socket from "@/services/socket";
import { getUsersPresence } from "@/services/api/presence";
import { StatusChangeEvent } from "@/types";
import { usePresenceStore } from "./usePresenceStore";

const MAX_IDS_PER_REQUEST = 200;

export const usePresenceSync = () => {
  useEffect(() => {
    const handleStatusChange = (event: StatusChangeEvent) => {
      usePresenceStore.getState().setPresence(event.userId, {
        isOnline: event.isOnline,
        lastSeen: event.lastSeen ?? undefined,
      });
    };

    const handleReconnect = () => {
      const userIds = Object.keys(usePresenceStore.getState().presenceByUserId);
      if (userIds.length === 0) return;

      getUsersPresence(userIds.slice(0, MAX_IDS_PER_REQUEST))
        .then((users) =>
          usePresenceStore.getState().setPresenceFromUsers(users),
        )
        .catch(() => {});
    };

    socket.on("statusChange", handleStatusChange);
    socket.io.on("reconnect", handleReconnect);
    return () => {
      socket.off("statusChange", handleStatusChange);
      socket.io.off("reconnect", handleReconnect);
    };
  }, []);
};
