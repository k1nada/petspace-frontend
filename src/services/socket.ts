import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
  auth: { token: typeof window !== "undefined" ? localStorage.getItem("token") : null },
});

export default socket;