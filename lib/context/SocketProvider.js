"use client";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { optimisticToggle, fetchWishlistIds, fetchmyWishlists } from "@/Redux/Slices/wishlistSlice";
import { fetchMyBookings } from "@/Redux/Slices/myBookingSlice";
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
      dispatch(fetchmyWishlists(user._id));
      dispatch(fetchMyBookings(user._id));
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

  // Reactive listener for login/auth changes across components
  useEffect(() => {
    const handleAuthChange = () => {
      const user = getStoredUser();
      const token = Cookies.get("token");
      if (user?._id && token) {
        dispatch(fetchWishlistIds(user._id));
        dispatch(fetchmyWishlists(user._id));
        dispatch(fetchMyBookings(user._id));
        if (socketRef.current?.connected) {
          socketRef.current.emit("join_customer_room", user._id);
          socketRef.current.emit("join-user-room", user._id);
        }
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("thevilla_auth_changed", handleAuthChange);
      window.addEventListener("storage", handleAuthChange);
      return () => {
        window.removeEventListener("thevilla_auth_changed", handleAuthChange);
        window.removeEventListener("storage", handleAuthChange);
      };
    }
  }, [dispatch]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
