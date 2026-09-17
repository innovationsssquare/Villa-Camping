import { io } from "socket.io-client";
import { SocketUrl } from "@/lib/API/Baseurl";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(SocketUrl, {
      withCredentials: true,
      transports: ["websocket"],
    });
  }
  return socket;
};
