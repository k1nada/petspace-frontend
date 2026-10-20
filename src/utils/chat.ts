export const SEND_TIMEOUT_MS = 10000;
export const MAX_MESSAGE_LENGTH = 2000;

export const SOCKET_EVENTS = {
  MESSAGE: "message",
  STATUS_CHANGE: "statusChange",
  NOTIFICATION: "notification",
};

export const getRoomId = (userId?: string, partnerId?: string) =>
  [userId, partnerId].sort().join("_");
