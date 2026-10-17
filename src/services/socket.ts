import { io } from "socket.io-client";
import { API_URL } from "@/config/env";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const socket = io(API_URL!, {
  auth: (cb) => cb({ token: getToken() }),
  autoConnect: !!getToken(),
});

export const reconnectSocket = () => {
  socket.disconnect();
  socket.connect();
};

export default socket;
