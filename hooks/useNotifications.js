"use client";

import { useState, useEffect, useCallback } from "react";
import { BaseUrl } from "@/lib/API/Baseurl";
import { useSocket } from "@/lib/context/SocketProvider";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();
  const reduxUser = useSelector((state) => state.auth?.user);

  const getCustomerId = () => {
    if (typeof window === "undefined") return null;
    return (
      localStorage.getItem("customer_id") ||
      localStorage.getItem("thevilla_user_id") ||
      Cookies.get("customer_id") ||
      reduxUser?._id ||
      null
    );
  };

  const fetchNotifications = useCallback(async () => {
    const customerId = getCustomerId();
    if (!customerId) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BaseUrl}/Notification/user/${customerId}?limit=40`);
      if (res.ok) {
        const json = await res.json();
        const data = Array.isArray(json.data) ? json.data : [];
        setNotifications(data);
        const unread = data.filter((n) => !n.isRead && n.status !== "read").length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.warn("Failed to fetch customer notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [reduxUser]);

  useEffect(() => {
    fetchNotifications();
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
    setNotifications((prev) =>
      prev.map((n) => (n._id === id || n.id === id ? { ...n, isRead: true, status: "read" } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await fetch(`${BaseUrl}/Notification/read/${id}`, {
        method: "PATCH",
      });
    } catch (e) {}
  };

  const markAllAsRead = async () => {
    const customerId = getCustomerId();
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true, status: "read" }))
    );
    setUnreadCount(0);

    if (customerId) {
      try {
        await fetch(`${BaseUrl}/Notification/read-all/${customerId}`, {
          method: "PATCH",
        });
      } catch (e) {}
    }
  };

  const removeNotification = async (id) => {
    setNotifications((prev) =>
      prev.filter((n) => n._id !== id && n.id !== id)
    );
    try {
      await fetch(`${BaseUrl}/Notification/${id}`, {
        method: "DELETE",
      });
    } catch (e) {}
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
