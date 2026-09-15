"use client";

import React, { useState } from "react";
import {
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  XCircle,
  AlertCircle,
  Sparkles,
  CalendarCheck,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FaBell } from "react-icons/fa6";
import { useNotifications } from "@/hooks/useNotifications";
import Link from "next/link";

// Helper function to format the timestamp
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

// Get icon for notification type
function getNotificationBadge(type) {
  switch (type) {
    case "booking_confirmed":
    case "payment_successful":
      return {
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
        bg: "bg-emerald-50 border-emerald-200",
      };
    case "booking_created":
    case "payment_pending":
      return {
        icon: <CalendarCheck className="w-4 h-4 text-blue-600" />,
        bg: "bg-blue-50 border-blue-200",
      };
    case "booking_reminder":
      return {
        icon: <Clock className="w-4 h-4 text-[#ff6900]" />,
        bg: "bg-orange-50 border-orange-200",
      };
    case "payment_failed":
      return {
        icon: <AlertCircle className="w-4 h-4 text-amber-600" />,
        bg: "bg-amber-50 border-amber-200",
      };
    case "booking_cancelled":
      return {
        icon: <XCircle className="w-4 h-4 text-rose-600" />,
        bg: "bg-rose-50 border-rose-200",
      };
    case "announcement":
    default:
      return {
        icon: <Sparkles className="w-4 h-4 text-purple-600" />,
        bg: "bg-purple-50 border-purple-200",
      };
  }
}

export function NotificationSheet({ trigger, open: controlledOpen, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications();

  const handleOpenChange = (newOpen) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      {trigger !== undefined ? (
        trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative rounded-full border-gray-200 border bg-white/90 h-8 w-8 p-0 flex items-center justify-center shadow-2xs hover:bg-neutral-50 text-neutral-800 cursor-pointer"
          >
            <FaBell className="h-3.5 w-3.5 text-neutral-700" />
            {unreadCount > 0 && (
              <Badge
                className="absolute -top-1 -right-1 px-1 py-0 bg-[#ff6900] text-white border-1 border-white min-w-[1rem] h-4 text-[9px] flex items-center justify-center"
                variant="default"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
      )}

      <SheetContent className="w-full sm:max-w-md p-0 overflow-hidden bg-white border-none z-50">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 border-b border-gray-200 bg-neutral-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-lg font-black text-neutral-900">
                  Notifications
                </SheetTitle>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-[#ff6900] text-white text-[10px] font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-xs font-semibold text-[#ff6900] hover:text-[#e05d00] transition-colors cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-auto p-2 sm:p-3">
            {loading ? (
              <div className="space-y-2 p-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-16 bg-neutral-100 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-orange-50 text-[#ff6900] mb-3">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-1">
                  No notifications
                </h3>
                <p className="text-xs text-gray-500 max-w-xs">
                  {`You're all caught up! You'll receive alerts for bookings and payments here.`}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => {
                  const badge = getNotificationBadge(notification.type);
                  const isUnread =
                    !notification.isRead && notification.status !== "read";

                  return (
                    <div
                      key={notification._id || notification.id}
                      onClick={() =>
                        markAsRead(notification._id || notification.id)
                      }
                      className={cn(
                        "group relative p-3 rounded-xl border transition-all duration-150 cursor-pointer bg-white flex items-start gap-3 shadow-2xs hover:shadow-xs",
                        isUnread
                          ? "border-orange-200 bg-orange-50/25"
                          : "border-neutral-200/80 hover:border-neutral-300"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border",
                          badge.bg
                        )}
                      >
                        {badge.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5">
                          <h4
                            className={cn(
                              "text-xs text-neutral-900 truncate leading-snug",
                              isUnread ? "font-black" : "font-bold"
                            )}
                          >
                            {notification.title}
                          </h4>
                          <span className="text-[10px] text-neutral-400 shrink-0 whitespace-nowrap">
                            {formatTimestamp(
                              notification.createdAt || notification.timestamp
                            )}
                          </span>
                        </div>

                        <p className="text-[11px] text-neutral-600 mt-0.5 line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-100">
                          {notification.bookingId ? (
                            <Link
                              href="/booking"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenChange(false);
                              }}
                              className="text-[10px] font-bold text-[#ff6900] hover:text-[#e05d00] flex items-center gap-0.5"
                            >
                              <span>View Booking</span>
                              <ChevronRight className="w-2.5 h-2.5" />
                            </Link>
                          ) : (
                            <span />
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(
                                notification._id || notification.id
                              );
                            }}
                            className="w-5 h-5 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 flex items-center justify-center transition-colors"
                            aria-label="Remove"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {isUnread && (
                        <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-2">
            <Link
              href="/notifications"
              onClick={() => handleOpenChange(false)}
              className="text-xs font-bold text-[#ff6900] hover:underline"
            >
              Open Full Notifications Page
            </Link>

            <Button
              variant="outline"
              size="sm"
              className="text-xs font-bold text-white bg-black hover:bg-neutral-800 rounded-lg px-3"
              onClick={() => handleOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
