import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
  auth: (cb) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    cb({ token });
  },
});

export const reconnectSocket = () => {
  socket.disconnect();
  socket.connect();
};

export default socket;
