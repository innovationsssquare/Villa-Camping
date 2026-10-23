"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/Productasset/mainlogo_clean.png";
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
  Phone,
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
  const { isVisible } = useScrollDirection();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/booking/success")) return null;

  const isHome = pathname === "/";
  const isLocationPage =
    pathname === "/" ||
    pathname === "/explore" ||
    pathname.startsWith("/products/") ||
    pathname.startsWith("/category/");

  const pageMeta = !isLocationPage ? resolvePageMeta(pathname) : null;
  const isTransparent = isHome && !isScrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 w-full px-3 pt-2 pb-2 z-50 transition-all duration-300 ease-out md:hidden",
        isVisible ? "translate-y-0" : "-translate-y-full",
        isTransparent
          ? "bg-transparent shadow-none border-b border-transparent text-white"
          : "bg-white/95 backdrop-blur-md shadow-xs border-b border-neutral-200/80 text-neutral-900 rounded-b-xl"
      )}
    >
      <div className="flex items-center justify-between">
        {/* Left Side: Brand Logo / Sidebar Trigger */}
        <div className="flex items-center gap-2">
          <UserSidebar isTransparent={isTransparent} />

          {isHome ? (
            <div
              onClick={() => router.push("/")}
              className="flex items-center cursor-pointer transition-opacity"
            >
              <Image
                src={Logo}
                alt="TheVillaCamp"
                width={100}
                height={26}
                priority
                className={cn(
                  "h-6 w-auto object-contain transition-all duration-300",
                  isTransparent ? "brightness-0 invert" : ""
                )}
              />
            </div>
          ) : isLocationPage ? (
            <div className="flex items-center gap-1 text-[10px]">
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

        {/* Right Side: StayVista Style [Call Us] Button & Notifications */}
        <div className="flex items-center gap-2">
          <a
            href="tel:+918669186483"
            className={cn(
              "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all active:scale-95 shadow-2xs",
              isTransparent
                ? "border border-white/50 bg-black/25 backdrop-blur-md text-white hover:bg-black/35"
                : "border border-neutral-200 bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
            )}
          >
            <Phone className="w-3 h-3 text-[#ff6900]" />
            <span>Call Us</span>
          </a>

          <NotificationSheet
            trigger={
              <button
                type="button"
                className={cn(
                  "relative rounded-full h-8 w-8 p-0 flex items-center justify-center transition-all cursor-pointer shadow-2xs",
                  isTransparent
                    ? "border border-white/40 bg-black/25 backdrop-blur-md text-white hover:bg-black/35"
                    : "border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700"
                )}
              >
                <Bell className="h-3.5 w-3.5" />
              </button>
            }
          />
        </div>
      </div>

      {/* Scrolled Compact Search Bar on Category / Home */}
      {(pathname.startsWith("/category/") || (isHome && isScrolled)) && (
        <div className="mt-2 flex w-full justify-between items-center animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-full">
            <BookingSearchBox />
          </div>
        </div>
      )}
    </header>
  );
}
