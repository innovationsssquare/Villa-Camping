"use client";

import { useState, useEffect } from "react";
import {
  BellRing,
  MapPin,
  Sparkles,
  CheckCircle2,
  X,
  ShieldCheck,
} from "lucide-react";

export default function WebPermissionsPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("thevillacamp_permissions_prompt");
      if (saved) {
        const parsed = JSON.parse(saved);
        // If granted or dismissed within 14 days, don't show
        const fourteenDays = 14 * 24 * 60 * 60 * 1000;
        if (Date.now() - (parsed.timestamp || 0) < fourteenDays) {
          return;
        }
      }

      // Show after 4.5 seconds delay
      const timer = setTimeout(() => {
        // If browser already has notification permission granted, don't bother
        if (
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          return;
        }
        setIsVisible(true);
      }, 4500);

      return () => clearTimeout(timer);
    } catch (e) {
      console.warn("Permissions check error:", e);
    }
  }, []);

  const handleAllowPermissions = async () => {
    let notificationGranted = false;
    let locationGranted = false;

    // 1. Request Notification permission
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const perm = await Notification.requestPermission();
        if (perm === "granted") {
          notificationGranted = true;
        }
      } catch (e) {
        console.warn("Notification request error:", e);
      }
    }

    // 2. Request Geolocation
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      try {
        await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              locationGranted = true;
              try {
                sessionStorage.setItem(
                  "user_coords",
                  JSON.stringify({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                  })
                );
              } catch (err) {}
              resolve();
            },
            () => {
              resolve();
            },
            { timeout: 8000 }
          );
        });
      } catch (e) {
        console.warn("Location request error:", e);
      }
    }

    // Save in localStorage
    try {
      localStorage.setItem(
        "thevillacamp_permissions_prompt",
        JSON.stringify({
          status: "granted",
          notificationGranted,
          locationGranted,
          timestamp: Date.now(),
        })
      );
    } catch (e) {}

    setStatusMessage("Preferences saved! Enjoy your tailored experience.");
    setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(
        "thevillacamp_permissions_prompt",
        JSON.stringify({
          status: "dismissed",
          timestamp: Date.now(),
        })
      );
    } catch (e) {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 max-w-sm w-full z-40 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-neutral-200/90 p-4 sm:p-5 shadow-2xl space-y-3.5">
        {statusMessage ? (
          <div className="py-2 flex items-center justify-center gap-2 text-emerald-600 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-orange-100 text-[#ff6900] flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-[#ff6900] uppercase tracking-wider">
                  Personalize Your Getaway
                </span>
              </div>
              <button
                onClick={handleDismiss}
                className="w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close permission prompt"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h4 className="text-sm font-bold text-neutral-900 leading-snug">
                Enable Alerts &amp; Nearby Stays
              </h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Allow notifications and location to unlock real-time benefits:
              </p>
            </div>

            {/* Feature Points */}
            <div className="space-y-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 text-[11px] text-neutral-700">
              <div className="flex items-start gap-2">
                <BellRing className="w-3.5 h-3.5 text-[#ff6900] shrink-0 mt-0.5" />
                <span>Instant alerts for secret flash discounts &amp; weekend villa openings.</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Auto-sort luxury stays closest to your departure point.</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={handleAllowPermissions}
                className="flex-1 h-9 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-900 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Allow Access</span>
              </button>
              <button
                onClick={handleDismiss}
                className="h-9 px-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-semibold text-xs transition-all cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
