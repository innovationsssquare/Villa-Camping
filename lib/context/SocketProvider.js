"use client";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { optimisticToggle, fetchWishlistIds } from "@/Redux/Slices/wishlistSlice";
import { getStoredUser } from "@/lib/auth";
import { SocketUrl, getSocketUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const url = getSocketUrl();
    const token = Cookies.get("token");
    if (!url || !token) return;

    const user = getStoredUser();
    if (user?._id) {
      dispatch(fetchWishlistIds(user._id));
    }

    const socket = io(url, {
      withCredentials: true,
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      const activeUser = getStoredUser();
      if (activeUser?._id) {
        socket.emit("join_customer_room", activeUser._id);
        socket.emit("join-user-room", activeUser._id);
      }
    });

    socket.on("wishlist:update", (payload) => {
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
