"use client";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { optimisticToggle } from "@/Redux/Slices/wishlistSlice";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    socketRef.current = io(
      process.env.NEXT_PUBLIC_PRODUCTION_URL,
      {
        withCredentials: true,
      }
    );

    // 🔥 Wishlist realtime sync
    socketRef.current.on("wishlist:update", (payload) => {
      dispatch(optimisticToggle(payload));
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
