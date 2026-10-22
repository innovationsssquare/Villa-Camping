"use client";

import { useState, useEffect, useCallback } from "react";
import { BaseUrl } from "@/lib/API/Baseurl";
import { useSocket } from "@/lib/context/SocketProvider";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { getStoredUser } from "@/lib/auth";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();
  const reduxUser = useSelector((state) => state.auth?.user);

  const getAuth = useCallback(() => {
    if (typeof window === "undefined") return { customerId: null, token: null };
    const stored = getStoredUser() || {};
    const token =
      Cookies.get("token") ||
      stored.token ||
      localStorage.getItem("thevilla_token") ||
      null;
    const customerId =
      stored._id ||
      localStorage.getItem("thevilla_user_id") ||
      localStorage.getItem("customer_id") ||
      Cookies.get("customer_id") ||
      reduxUser?._id ||
      null;
    return { customerId, token };
  }, [reduxUser]);

  const fetchNotifications = useCallback(async () => {
    const { customerId, token } = getAuth();
    if (!customerId || !token) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BaseUrl}/Notification/user/${customerId}?limit=40`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          token: token,
        },
      });

      if (res.ok) {
        const json = await res.json();
        const data = Array.isArray(json.data) ? json.data : [];
        setNotifications(data);
        const unread = data.filter((n) => !n.isRead && n.status !== "read").length;
        setUnreadCount(unread);
      } else if (res.status === 401 || res.status === 403) {
        console.warn("Notification fetch unauthorized (invalid or expired token)");
      }
    } catch (err) {
      console.warn("Failed to fetch customer notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [getAuth]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Listen for login/logout auth state changes across the app
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleAuthEvent = () => {
      fetchNotifications();
    };

    window.addEventListener("thevilla_auth_changed", handleAuthEvent);
    window.addEventListener("storage", handleAuthEvent);

    return () => {
      window.removeEventListener("thevilla_auth_changed", handleAuthEvent);
      window.removeEventListener("storage", handleAuthEvent);
    };
  }, [fetchNotifications]);

  // Real-time listener for incoming customer notifications
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("customer_notification_new", handleNewNotification);
    return () => {
      socket.off("customer_notification_new", handleNewNotification);
    };
  }, [socket]);

  const markAsRead = async (id) => {
    const { token } = getAuth();
    setNotifications((prev) =>
      prev.map((n) => (n._id === id || n.id === id ? { ...n, isRead: true, status: "read" } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    if (token) {
      try {
        await fetch(`${BaseUrl}/Notification/read/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            token: token,
          },
        });
      } catch (e) {}
    }
  };

  const markAllAsRead = async () => {
    const { customerId, token } = getAuth();
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true, status: "read" }))
    );
    setUnreadCount(0);

    if (customerId && token) {
      try {
        await fetch(`${BaseUrl}/Notification/read-all/${customerId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            token: token,
          },
        });
      } catch (e) {}
    }
  };

  const removeNotification = async (id) => {
    const { token } = getAuth();
    setNotifications((prev) =>
      prev.filter((n) => n._id !== id && n.id !== id)
    );

    if (token) {
      try {
        await fetch(`${BaseUrl}/Notification/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            token: token,
          },
        });
      } catch (e) {}
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    refresh: fetchNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
  };
}
