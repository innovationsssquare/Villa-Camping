"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Listprop from "@/public/Homeasset/Listprop.jpg";
import { useAuthModal } from "@/context/AuthModalContext";

import {
  Home,
  Compass,
  Sparkles,
  CalendarCheck,
  Heart,
  User,
  MessageCircle,
  Bell,
  ShieldCheck,
  FileText,
  HelpCircle,
  LogOut,
  LogIn,
  ChevronRight,
  ArrowRight,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
} from "lucide-react";
import { TiThMenu } from "react-icons/ti";

export function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { openAuthModal } = useAuthModal();
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Read session whenever opened
  useEffect(() => {
    try {
      const token = Cookies.get("token");
      const storedUserStr = localStorage.getItem("thevilla_user");
      if (token && storedUserStr) {
        setCurrentUser(JSON.parse(storedUserStr));
        setIsLoggedIn(true);
      } else if (token) {
        setCurrentUser({ fullName: "Valued Guest" });
        setIsLoggedIn(true);
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
    } catch {
      setIsLoggedIn(false);
    }
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleNavigate = (href) => {
    setOpen(false);
    router.push(href);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("customer_id");
    localStorage.removeItem("thevilla_user");
    localStorage.removeItem("thevilla_user_id");
    localStorage.removeItem("customer_id");
    setCurrentUser(null);
    setIsLoggedIn(false);
    setOpen(false);
    router.push("/");
    window.location.reload();
  };

  const isActive = (href) => {
    if (pathname === href) return true;
    if (href === "/account") return pathname === "/account";
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full p-0 flex items-center justify-center hover:bg-neutral-100 text-neutral-800"
        >
          <TiThMenu size={18} />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[75vw] max-w-[75vw] sm:w-[350px] sm:max-w-sm p-0 bg-white border-r border-neutral-200 flex flex-col h-full z-50"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>Explore ThevillaCamp stays and options</SheetDescription>
        </SheetHeader>

        {/* User Card Header - 75% width on mobile */}
        <div className="p-4 pt-8 bg-gradient-to-b from-neutral-50 to-white border-b border-neutral-100">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 ring-2 ring-[#ff6900]/20 shadow-xs shrink-0">
                {currentUser?.profilePic ? (
                  <AvatarImage src={currentUser.profilePic} alt={currentUser?.fullName} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-[#ff6900] to-[#e05d00] text-sm font-bold text-white">
                  {getUserInitials(currentUser?.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-neutral-900 truncate">
                    {currentUser?.fullName || "Member"}
                  </h3>
                  <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-neutral-500 truncate">
                  {currentUser?.email || currentUser?.mobile || "Active Account"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#ff6900] animate-pulse" />
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#ff6900]">
                  ThevillaCamp
                </span>
              </div>
              <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                Welcome to luxury stays
              </h3>
              <Button
                onClick={() => {
                  setOpen(false);
                  openAuthModal();
                }}
                className="w-full bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs font-semibold rounded-xl py-2 shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In / Register
              </Button>
            </div>
          )}
        </div>

        {/* Scrollable Navigation Body with shadcn ScrollArea */}
        <ScrollArea className="flex-1 px-3.5 py-3.5">
          <div className="space-y-4">
            {/* Quick Access Row */}
            <div className="grid grid-cols-3 gap-2 bg-neutral-50 p-2 rounded-xl border border-neutral-100">
              <button
                onClick={() => handleNavigate("/account")}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all cursor-pointer touch-manipulation",
                  isActive("/account") ? "bg-white text-[#ff6900] shadow-xs font-bold" : "text-neutral-600 hover:bg-white/60"
                )}
              >
                <User className="h-4 w-4 mb-1" />
                <span className="text-[10px] font-medium">Account</span>
              </button>
              <button
                onClick={() => handleNavigate("/account/support")}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all cursor-pointer touch-manipulation",
                  isActive("/account/support") ? "bg-white text-[#ff6900] shadow-xs font-bold" : "text-neutral-600 hover:bg-white/60"
                )}
              >
                <MessageCircle className="h-4 w-4 mb-1" />
                <span className="text-[10px] font-medium">Support</span>
              </button>
              <button
                onClick={() => handleNavigate("/notifications")}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all cursor-pointer touch-manipulation",
                  isActive("/notifications") ? "bg-white text-[#ff6900] shadow-xs font-bold" : "text-neutral-600 hover:bg-white/60"
                )}
              >
                <Bell className="h-4 w-4 mb-1" />
                <span className="text-[10px] font-medium">Alerts</span>
              </button>
            </div>

            {/* Primary Exploration */}
            <div className="space-y-0.5">
              <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 px-1 mb-1">
                Explore
              </p>

              <button
                onClick={() => handleNavigate("/")}
                className={cn(
                  "flex w-full items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all",
                  pathname === "/" ? "bg-orange-50 text-[#ff6900] font-bold" : "text-neutral-700 hover:bg-neutral-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <Home className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Home</span>
                </div>
                <ChevronRight className="w-3 h-3 text-neutral-400" />
              </button>

              <button
                onClick={() => handleNavigate("/category/all")}
                className={cn(
                  "flex w-full items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all",
                  pathname.startsWith("/category") ? "bg-orange-50 text-[#ff6900] font-bold" : "text-neutral-700 hover:bg-neutral-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-neutral-500" />
                  <span>All Stays</span>
                </div>
                <ChevronRight className="w-3 h-3 text-neutral-400" />
              </button>

              <button
                onClick={() => handleNavigate("/experiences")}
                className={cn(
                  "flex w-full items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all",
                  pathname.startsWith("/experiences") ? "bg-orange-50 text-[#ff6900] font-bold" : "text-neutral-700 hover:bg-neutral-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Experiences</span>
                </div>
                <span className="text-[8px] font-semibold bg-amber-100 text-amber-800 px-1 py-0.2 rounded-full">
                  Lonavala
                </span>
              </button>

              <button
                onClick={() => handleNavigate("/services")}
                className={cn(
                  "flex w-full items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all",
                  pathname.startsWith("/services") ? "bg-orange-50 text-[#ff6900] font-bold" : "text-neutral-700 hover:bg-neutral-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
                  <span>Concierge</span>
                </div>
                <span className="text-[8px] font-semibold bg-orange-100 text-[#ff6900] px-1 py-0.2 rounded-full">
                  Soon
                </span>
              </button>
            </div>

            <Separator className="bg-neutral-100" />

            {/* Bookings & Wishlist */}
            <div className="space-y-0.5">
              <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 px-1 mb-1">
                Your Trips
              </p>

              <button
                onClick={() => handleNavigate("/booking")}
                className={cn(
                  "flex w-full items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all",
                  isActive("/booking") ? "bg-orange-50 text-[#ff6900] font-bold" : "text-neutral-700 hover:bg-neutral-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-3.5 h-3.5 text-neutral-500" />
                  <span>My Bookings</span>
                </div>
                <ChevronRight className="w-3 h-3 text-neutral-400" />
              </button>

              <button
                onClick={() => handleNavigate("/wishlist")}
                className={cn(
                  "flex w-full items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all",
                  isActive("/wishlist") ? "bg-orange-50 text-[#ff6900] font-bold" : "text-neutral-700 hover:bg-neutral-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Wishlist</span>
                </div>
                <ChevronRight className="w-3 h-3 text-neutral-400" />
              </button>
            </div>

            <Separator className="bg-neutral-100" />

            {/* Host Banner */}
            <div
              onClick={() => handleNavigate("/become-host")}
              className="cursor-pointer p-2.5 rounded-xl bg-neutral-900 text-white flex items-center gap-2.5 group transition-transform active:scale-98"
            >
              <div className="h-9 w-9 rounded-lg overflow-hidden shrink-0 border border-white/10">
                <Image
                  src={Listprop}
                  alt="Become a Host"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-bold text-white flex items-center gap-1">
                  Become a Host <ArrowRight className="w-2.5 h-2.5 text-[#ff6900]" />
                </h4>
                <p className="text-[9px] text-neutral-400 truncate">
                  Earn with your villa
                </p>
              </div>
            </div>

            {/* Legal & Policies */}
            <div className="space-y-0.5">
              <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 px-1 mb-1">
                Policies & Help
              </p>

              <button
                onClick={() => handleNavigate("/privacy-policy")}
                className={cn(
                  "flex w-full items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                  isActive("/privacy-policy") ? "bg-orange-50 text-[#ff6900] font-bold" : "text-neutral-700 hover:bg-neutral-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="text-[11px]">Privacy Policy</span>
                </div>
                <ChevronRight className="w-3 h-3 text-neutral-400" />
              </button>

              <button
                onClick={() => handleNavigate("/terms-of-service")}
                className={cn(
                  "flex w-full items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                  isActive("/terms-of-service") || isActive("/terms-and-conditions")
                    ? "bg-orange-50 text-[#ff6900] font-bold"
                    : "text-neutral-700 hover:bg-neutral-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="text-[11px]">Terms of Service</span>
                </div>
                <ChevronRight className="w-3 h-3 text-neutral-400" />
              </button>

              <button
                onClick={() => handleNavigate("/cancellation-policy")}
                className={cn(
                  "flex w-full items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                  isActive("/cancellation-policy") ? "bg-orange-50 text-[#ff6900] font-bold" : "text-neutral-700 hover:bg-neutral-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="text-[11px]">Cancellation</span>
                </div>
                <ChevronRight className="w-3 h-3 text-neutral-400" />
              </button>
            </div>

            {/* Social Icons */}
            <div className="pt-1">
              <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 px-1 mb-1.5">
                Connect
              </p>
              <div className="flex items-center gap-1.5 px-1">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 hover:text-pink-600 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 hover:text-blue-500 transition-colors"
                >
                  <Twitter className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 hover:text-blue-700 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 hover:text-blue-600 transition-colors"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Drawer Bottom Action */}
        <div className="p-3.5 border-t border-neutral-100 bg-neutral-50/80 mt-auto">
          {isLoggedIn ? (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-center text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl h-10 gap-1.5 transition-all cursor-pointer touch-manipulation"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          ) : (
            <Button
              onClick={() => {
                setOpen(false);
                openAuthModal();
              }}
              className="w-full justify-center text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl h-10 transition-all cursor-pointer touch-manipulation"
            >
              <User className="h-4 w-4 mr-1.5" />
              Sign In
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
