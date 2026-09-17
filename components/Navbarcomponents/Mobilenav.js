"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { UserSidebar } from "./Sidebar";
import { NotificationSheet } from "./Notificationsheet";

import { BookingSearchBox } from "./booking-search-box";
import UserLocationDisplay from "../Homecomponets/user-location-display";

import {
  ShieldCheck,
  RotateCcw,
  Scale,
  Sparkles,
  PhoneCall,
  Home,
  Compass,
  Luggage,
  Heart,
  User,
  Settings,
  LifeBuoy,
  Bell,
  Share2,
} from "lucide-react";

const PAGE_META = {
  "/privacy-policy": { title: "Privacy Policy", icon: ShieldCheck },
  "/cancellation-policy": { title: "Cancellation Policy", icon: RotateCcw },
  "/terms-and-conditions": { title: "Terms & Conditions", icon: Scale },
  "/terms-of-service": { title: "Terms of Service", icon: Scale },
  "/about": { title: "About Us", icon: Sparkles },
  "/contact": { title: "Contact Us", icon: PhoneCall },
  "/become-host": { title: "Become a Host", icon: Home },
  "/experiences": { title: "Experiences", icon: Compass },
  "/services": { title: "Our Services", icon: Sparkles },
  "/booking": { title: "My Bookings", icon: Luggage },
  "/wishlist": { title: "My Wishlist", icon: Heart },
  "/account": { title: "My Account", icon: User },
  "/account/settings": { title: "Settings", icon: Settings },
  "/account/support": { title: "Help & Support", icon: LifeBuoy },
  "/notifications": { title: "Notifications", icon: Bell },
  "/account/privacy-policy": { title: "Privacy Policy", icon: ShieldCheck },
  "/account/terms-conditions": { title: "Terms & Conditions", icon: Scale },
  "/account/contact-us": { title: "Contact Us", icon: PhoneCall },
  "/account/support/contactus": { title: "Contact Support", icon: LifeBuoy },
  "/account/support/social": { title: "Social Media", icon: Share2 },
};

function resolvePageMeta(pathname) {
  if (!pathname) return null;
  const p = pathname.toLowerCase();
  if (PAGE_META[p]) return PAGE_META[p];

  const clean = p.replace(/\/$/, "");
  if (PAGE_META[clean]) return PAGE_META[clean];

  const segments = clean.split("/").filter(Boolean);
  if (segments.length > 0) {
    const last = segments[segments.length - 1];
    const formatted = last
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return { title: formatted, icon: Sparkles };
  }
  return null;
}

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState({
    menu: false,
    notifications: false,
  });

  const cartItemCount = 3;
  const { isVisible } = useScrollDirection();

  const isLocationPage =
    pathname === "/" ||
    pathname === "/explore" ||
    pathname.startsWith("/products/") ||
    pathname.startsWith("/category/");

  const pageMeta = !isLocationPage ? resolvePageMeta(pathname) : null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 w-full rounded-b-xl px-3 pt-1 pb-1.5 z-50 transition-transform  duration-300 ease-in-out md:hidden shadow-xs",
        isVisible
          ? "translate-y-0 bg-white/95 backdrop-blur-md"
          : "-translate-y-8 bg-white"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <UserSidebar />
          {isLocationPage ? (
            <div className="flex items-center gap-1 text-[10px]">
              <span className="uppercase font-bold text-neutral-400">Location:</span>
              <UserLocationDisplay />
            </div>
          ) : pageMeta ? (
            <div className="flex items-center gap-1.5 min-w-0">
              {pageMeta.icon && (
                <pageMeta.icon className="w-4 h-4 text-[#ff6900] shrink-0" />
              )}
              <span className="text-sm font-bold text-neutral-900 truncate">
                {pageMeta.title}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-1.5">
          <NotificationSheet />
        </div>
      </div>

      {(pathname === "/" || pathname.startsWith("/category/")) && (
        <div className="mt-1 flex w-full justify-between items-center">
          <div className="w-full">
            <BookingSearchBox />
          </div>
        </div>
      )}
    </header>
  );
}
