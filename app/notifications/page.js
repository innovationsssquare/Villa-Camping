"use client";

import React, { useState, useEffect } from "react";
import { UserSidebar } from "@/components/Navbarcomponents/Sidebar";
import { NotificationSheet } from "@/components/Navbarcomponents/Notificationsheet";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { Button } from "@heroui/react";
import {
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  XCircle,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Trash2,
  CalendarCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Helper function to format timestamp
function formatTimestamp(dateInput) {
  if (!dateInput) return "just now";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "recently";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return "just now";
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
  }
}

// Get the appropriate icon and accent color for the notification type
function getNotificationBadge(type) {
  switch (type) {
    case "booking_confirmed":
    case "payment_successful":
      return {
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
        bg: "bg-emerald-50 border-emerald-200",
        label: "Confirmed",
      };
    case "booking_created":
    case "payment_pending":
      return {
        icon: <CalendarCheck className="w-5 h-5 text-blue-600" />,
        bg: "bg-blue-50 border-blue-200",
        label: "Booking",
      };
    case "booking_reminder":
      return {
        icon: <Clock className="w-5 h-5 text-[#ff6900]" />,
        bg: "bg-orange-50 border-orange-200",
        label: "Reminder",
      };
    case "payment_failed":
      return {
        icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
        bg: "bg-amber-50 border-amber-200",
        label: "Payment",
      };
    case "booking_cancelled":
      return {
        icon: <XCircle className="w-5 h-5 text-rose-600" />,
        bg: "bg-rose-50 border-rose-200",
        label: "Cancelled",
      };
    case "announcement":
    default:
      return {
        icon: <Sparkles className="w-5 h-5 text-purple-600" />,
        bg: "bg-purple-50 border-purple-200",
        label: "Update",
      };
  }
}

const NotificationsPage = () => {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications();

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      {/* Mobile Top Header */}
      <section className="w-full sticky top-0 bg-white/95 backdrop-blur-md px-4 py-3 z-50 border-b border-neutral-150 md:hidden shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserSidebar />
            <div className="flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-[#ff6900]" />
              <span className="text-sm font-bold text-neutral-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#ff6900] text-white text-[10px] font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-semibold text-[#ff6900] hover:text-[#e05d00] transition-colors"
              >
                Mark all read
              </button>
            )}
            <NotificationSheet />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 sm:py-10">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-700" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-neutral-900 flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-[#ff6900] text-white text-xs font-bold rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Stay updated with your bookings, payments, and property announcements.
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="flat"
              size="sm"
              onPress={markAllAsRead}
              className="text-xs font-bold text-[#ff6900] bg-orange-50 hover:bg-orange-100 rounded-xl"
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="space-y-3 py-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-20 bg-white rounded-2xl border border-neutral-200/80 animate-pulse"
              />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200/90 p-8 sm:p-12 text-center shadow-xs flex flex-col items-center justify-center my-8">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-[#ff6900] flex items-center justify-center mb-4 shadow-xs">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-neutral-900 mb-1">
              No notifications yet
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mb-6 leading-relaxed">
              When you reserve a villa, complete a payment, or receive updates about your trip, you’ll see them right here.
            </p>
            <Link
              href="/booking"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6900] to-[#e05d00] text-white text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all"
            >
              View My Bookings
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {notifications.map((notification) => {
              const badge = getNotificationBadge(notification.type);
              const isUnread = !notification.isRead && notification.status !== "read";

              return (
                <div
                  key={notification._id || notification.id}
                  onClick={() => markAsRead(notification._id || notification.id)}
                  className={cn(
                    "group relative p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer bg-white flex items-start gap-3.5 shadow-2xs hover:shadow-xs",
                    isUnread
                      ? "border-orange-200 bg-orange-50/20"
                      : "border-neutral-200/80 hover:border-neutral-300"
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border",
                      badge.bg
                    )}
                  >
                    {badge.icon}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={cn(
                          "text-sm text-neutral-900 truncate leading-snug",
                          isUnread ? "font-black" : "font-bold"
                        )}
                      >
                        {notification.title}
                      </h4>
                      <span className="text-[11px] text-neutral-400 shrink-0 whitespace-nowrap">
                        {formatTimestamp(notification.createdAt || notification.timestamp)}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed line-clamp-2">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-100">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        {badge.label}
                      </span>

                      <div className="flex items-center gap-2">
                        {notification.bookingId && (
                          <Link
                            href="/booking"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[11px] font-bold text-[#ff6900] hover:text-[#e05d00] flex items-center gap-0.5"
                          >
                            <span>View Booking</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification._id || notification.id);
                          }}
                          className="w-6 h-6 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 flex items-center justify-center transition-colors"
                          aria-label="Delete notification"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Unread Orange Dot */}
                  {isUnread && (
                    <div className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-[#ff6900]" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default NotificationsPage;
