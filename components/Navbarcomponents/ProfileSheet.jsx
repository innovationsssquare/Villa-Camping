"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import {
  Menu,
  User,
  Heart,
  CalendarCheck,
  ChevronRight,
  HelpCircle,
  Bell,
  Home as HomeIcon,
  LogOut,
  Sparkles,
  ShieldCheck,
  FileText,
  Compass,
  ArrowRight,
  LogIn
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { clearMyBookings } from "@/Redux/Slices/myBookingSlice";
import { useAuthModal } from "@/context/AuthModalContext";
import { NotificationSheet } from "./Notificationsheet";

export function ProfileSheet() {
  const [open, setOpen] = useState(false);
  const { openAuthModal } = useAuthModal();
  const [notificationSheetOpen, setNotificationSheetOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux state
  const wishlistIds = useSelector((state) => state?.wishlist?.ids || []);
  const wishlistItems = useSelector((state) => state?.wishlist?.wishlists || []);
  const bookings = useSelector((state) => state?.myBookings?.bookings || []);

  const wishlistCount =
    wishlistItems?.length ||
    (wishlistIds ? new Set(wishlistIds.map((id) => (id.includes(":") ? id.split(":")[1] : id))).size : 0);
  const bookingsCount = bookings?.length || 0;

  // Load user data on mount and whenever sheet opens
  useEffect(() => {
    try {
      const token = Cookies.get("token");
      const storedUserStr = localStorage.getItem("thevilla_user");
      if (token && storedUserStr) {
        const parsed = JSON.parse(storedUserStr);
        setCurrentUser(parsed);
        setIsLoggedIn(true);
      } else if (token) {
        setIsLoggedIn(true);
        setCurrentUser({ fullName: "Valued Guest" });
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
    } catch {
      setIsLoggedIn(false);
    }
  }, [open]);

  const handleNavigate = (path) => {
    setOpen(false);
    router.push(path);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("customer_id");
    localStorage.removeItem("thevilla_user");
    localStorage.removeItem("thevilla_user_id");
    localStorage.removeItem("customer_id");
    dispatch(clearMyBookings());
    setCurrentUser(null);
    setIsLoggedIn(false);
    setOpen(false);
    router.push("/");
    window.location.reload();
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2.5 rounded-full border-neutral-200 bg-white px-3.5 py-5 shadow-xs hover:border-neutral-300 hover:shadow-sm transition-all"
        >
          <Menu className="h-4 w-4 text-neutral-700" />
          <Avatar className="h-7 w-7 border border-neutral-200">
            {currentUser?.profilePic ? (
              <AvatarImage src={currentUser.profilePic} alt={currentUser.fullName} />
            ) : null}
            <AvatarFallback className="bg-neutral-900 text-[11px] font-medium text-white">
              {isLoggedIn ? getUserInitials(currentUser?.fullName) : <User className="h-3.5 w-3.5 text-neutral-300" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full p-0 sm:max-w-md bg-white flex flex-col h-full border-l border-neutral-200">
        {/* Header with User Info or Guest Welcome */}
        <SheetHeader className="border-b border-neutral-100 p-6 bg-gradient-to-b from-neutral-50/80 to-white">
          {isLoggedIn ? (
            <div className="flex items-center gap-3.5">
              <Avatar className="h-13 w-13 ring-2 ring-[#ff6900]/20 shadow-xs">
                {currentUser?.profilePic ? (
                  <AvatarImage src={currentUser.profilePic} alt={currentUser?.fullName} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-[#ff6900] to-[#e05d00] text-base font-bold text-white shadow-xs">
                  {getUserInitials(currentUser?.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <SheetTitle className="text-base font-bold text-neutral-900 truncate">
                    {currentUser?.fullName || "Member"}
                  </SheetTitle>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 mr-0.5" /> Verified
                  </span>
                </div>
                <SheetDescription className="text-xs text-neutral-500 truncate mt-0.5">
                  {currentUser?.email || currentUser?.mobile || "Active Account"}
                </SheetDescription>
              </div>
            </div>
          ) : (
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff6900] animate-pulse" />
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#ff6900]">
                  Welcome to ThevillaCamp
                </span>
              </div>
              <SheetTitle className="text-lg font-bold text-neutral-900">
                Sign in for the full luxury experience
              </SheetTitle>
              <SheetDescription className="text-xs text-neutral-500 mt-1 mb-4">
                Access your bookings, track saved wishlists, and unlock member-only stay privileges.
              </SheetDescription>

            </div>
          )}
        </SheetHeader>

        {/* Scrollable Navigation Items */}
        <ScrollArea className="flex-1 px-6 py-4">
          {/* Quick Stats Banner for Logged in Users */}
          {isLoggedIn && (
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              <div
                onClick={() => handleNavigate("/booking")}
                className="cursor-pointer group rounded-xl p-3 bg-neutral-50 hover:bg-orange-50/60 border border-neutral-100 hover:border-orange-200/70 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <CalendarCheck className="w-4 h-4 text-[#ff6900]" />
                  <span className="text-xs font-bold text-neutral-900 bg-white px-2 py-0.5 rounded-full shadow-2xs border border-neutral-100">
                    {bookingsCount}
                  </span>
                </div>
                <p className="text-xs font-semibold text-neutral-800">My Bookings</p>
                <p className="text-[11px] text-neutral-500">Upcoming & past</p>
              </div>

              <div
                onClick={() => handleNavigate("/wishlist")}
                className="cursor-pointer group rounded-xl p-3 bg-neutral-50 hover:bg-orange-50/60 border border-neutral-100 hover:border-orange-200/70 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <Heart className="w-4 h-4 text-[#ff6900]" />
                  <span className="text-xs font-bold text-neutral-900 bg-white px-2 py-0.5 rounded-full shadow-2xs border border-neutral-100">
                    {wishlistCount}
                  </span>
                </div>
                <p className="text-xs font-semibold text-neutral-800">Wishlist</p>
                <p className="text-[11px] text-neutral-500">Saved properties</p>
              </div>
            </div>
          )}

          {/* Primary Navigation Links */}
          <div className="space-y-1 mb-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2 px-1">
              Explore & Book
            </p>

            <button
              onClick={() => handleNavigate("/booking")}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-neutral-50 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-orange-50 flex items-center justify-center transition-colors">
                <CalendarCheck className="h-4 w-4 text-neutral-700 group-hover:text-[#ff6900]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-neutral-800 group-hover:text-neutral-950">
                    My Bookings
                  </p>
                  {bookingsCount > 0 && (
                    <Badge variant="secondary" className="rounded-full text-[10px] px-1.5 py-0 bg-neutral-100">
                      {bookingsCount}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-neutral-500">View reservations, invoices & status</p>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-700 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              onClick={() => handleNavigate("/wishlist")}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-neutral-50 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-orange-50 flex items-center justify-center transition-colors">
                <Heart className="h-4 w-4 text-neutral-700 group-hover:text-[#ff6900]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-neutral-800 group-hover:text-neutral-950">
                    Wishlist
                  </p>
                  {wishlistCount > 0 && (
                    <Badge className="bg-[#ff6900] text-white rounded-full text-[10px] px-1.5 py-0">
                      {wishlistCount}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-neutral-500">Your favorite villas, tents & cottages</p>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-700 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              onClick={() => handleNavigate("/experiences")}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-neutral-50 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-orange-50 flex items-center justify-center transition-colors">
                <Compass className="h-4 w-4 text-neutral-700 group-hover:text-[#ff6900]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-neutral-800 group-hover:text-neutral-950">
                    Experiences
                  </p>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full">
                    Lonavala
                  </span>
                </div>
                <p className="text-xs text-neutral-500">Tiger Point, Pawana Lake & scenic forts</p>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-700 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              onClick={() => handleNavigate("/services")}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-neutral-50 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-orange-50 flex items-center justify-center transition-colors">
                <Sparkles className="h-4 w-4 text-neutral-700 group-hover:text-[#ff6900]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-neutral-800 group-hover:text-neutral-950">
                    Concierge & Services
                  </p>
                  <span className="text-[10px] font-semibold bg-orange-100 text-[#ff6900] px-1.5 py-0.2 rounded-full">
                    Coming Soon
                  </span>
                </div>
                <p className="text-xs text-neutral-500">Private chef, bonfires & celebrations</p>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-700 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <Separator className="my-4 bg-neutral-100" />

          {/* Become a Host Card */}
          <div
            onClick={() => handleNavigate("/become-host")}
            className="cursor-pointer mb-5 p-4 rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-white shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <HomeIcon className="w-4 h-4 text-[#ff6900]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  Partner with Us
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              Become a Villa or Camp Host
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              List your premium property with ThevillaCamp and welcome verified travelers across Maharashtra.
            </p>
          </div>

          {/* Support & Preferences */}
          <div className="space-y-1 mb-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2 px-1">
              Assistance & Legal
            </p>

            <button
              onClick={() => {
                setOpen(false);
                setNotificationSheetOpen(true);
              }}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-neutral-50 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-neutral-200/60 flex items-center justify-center transition-colors">
                <Bell className="h-4 w-4 text-neutral-700" />
              </div>
              <span className="flex-1 text-sm font-medium text-neutral-800 group-hover:text-neutral-950">
                Notifications
              </span>
              <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-700" />
            </button>

            <button
              onClick={() => handleNavigate("/account/support")}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-neutral-50 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-neutral-200/60 flex items-center justify-center transition-colors">
                <HelpCircle className="h-4 w-4 text-neutral-700" />
              </div>
              <span className="flex-1 text-sm font-medium text-neutral-800 group-hover:text-neutral-950">
                Help Center & Support
              </span>
              <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-700" />
            </button>

            <button
              onClick={() => handleNavigate("/privacy-policy")}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-neutral-50 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-neutral-200/60 flex items-center justify-center transition-colors">
                <ShieldCheck className="h-4 w-4 text-neutral-700" />
              </div>
              <span className="flex-1 text-sm font-medium text-neutral-800 group-hover:text-neutral-950">
                Privacy Policy
              </span>
              <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-700" />
            </button>

            <button
              onClick={() => handleNavigate("/terms-of-service")}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-neutral-50 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-neutral-200/60 flex items-center justify-center transition-colors">
                <FileText className="h-4 w-4 text-neutral-700" />
              </div>
              <span className="flex-1 text-sm font-medium text-neutral-800 group-hover:text-neutral-950">
                Terms of Service
              </span>
              <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-700" />
            </button>
          </div>
        </ScrollArea>

        {/* Footer with Logout / Login action */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 mt-auto">
          {isLoggedIn ? (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-center text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all gap-2 cursor-pointer"
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
              className="w-full justify-center text-sm font-semibold bg-[#ff6900] hover:bg-[#e05d00] text-white rounded-xl transition-all gap-2 shadow-xs cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              Sign In / Register
            </Button>
          )}
        </div>
      </SheetContent>
      <NotificationSheet
        open={notificationSheetOpen}
        onOpenChange={setNotificationSheetOpen}
        trigger={null}
      />
    </Sheet>
  );
}

export default ProfileSheet;
