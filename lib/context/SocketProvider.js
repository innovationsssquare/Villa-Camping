"use client";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { optimisticToggle } from "@/Redux/Slices/wishlistSlice";
import Cookies from "js-cookie";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_PRODUCTION_URL;
    const token = Cookies.get("token");
    if (!url || !token) return;

    socketRef.current = io(url, {
      withCredentials: true,
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    socketRef.current.on("wishlist:update", (payload) => {
      dispatch(optimisticToggle(payload));
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [dispatch]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
