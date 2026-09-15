"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  User,
  CalendarCheck,
  Heart,
  HelpCircle,
  ShieldCheck,
  FileText,
  RotateCcw,
  LogOut,
  ChevronRight,
  Sparkles,
  Home,
  Bell,
  LogIn,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserSidebar } from "@/components/Navbarcomponents/Sidebar";
import { NotificationSheet } from "@/components/Navbarcomponents/Notificationsheet";
import { useAuthModal } from "@/context/AuthModalContext";
import { useSelector, useDispatch } from "react-redux";
import { clearMyBookings } from "@/Redux/Slices/myBookingSlice";

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { openAuthModal } = useAuthModal();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Redux state for counts
  const wishlistIds = useSelector((state) => state?.wishlist?.ids || []);
  const bookings = useSelector((state) => state?.myBookings?.bookings || []);

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
  }, []);

  useEffect(() => {
    // Desktop view uses ProfileSheet in the top navbar; redirect desktop visitors to home
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      router.replace("/");
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("customer_id");
    localStorage.removeItem("thevilla_user");
    localStorage.removeItem("thevilla_user_id");
    localStorage.removeItem("customer_id");
    dispatch(clearMyBookings());
    setCurrentUser(null);
    setIsLoggedIn(false);
    router.push("/");
    window.location.reload();
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
    <main className="min-h-screen bg-neutral-50 pb-24 pt-0 md:pt-24">
      {/* Mobile Header Bar */}
      <section className="w-full sticky top-0 bg-white/95 backdrop-blur-md px-4 py-3 z-40 border-b border-neutral-150 md:hidden flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <UserSidebar />
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#ff6900]" />
            <span className="text-sm font-bold text-neutral-900">My Account</span>
          </div>
        </div>
        <NotificationSheet />
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
        {/* Profile Card Header */}
        <div className="p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-2xs">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-[#ff6900]/25 shadow-xs">
                {currentUser?.profilePic ? (
                  <AvatarImage src={currentUser.profilePic} alt={currentUser.fullName} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-[#ff6900] to-[#e05d00] text-lg font-bold text-white">
                  {getUserInitials(currentUser?.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-neutral-900 truncate">
                    {currentUser?.fullName || "Member"}
                  </h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 mr-0.5" /> Verified
                  </span>
                </div>
                <p className="text-xs text-neutral-500 truncate mt-0.5">
                  {currentUser?.email || currentUser?.mobile || "Active Account"}
                </p>
                <div className="flex items-center gap-4 mt-2.5 text-xs text-neutral-600">
                  <span>
                    <strong className="text-neutral-900 font-bold">{bookings.length}</strong> Bookings
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-neutral-900 font-bold">{wishlistIds.length}</strong> Saved
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6900] mx-auto">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  Sign In to Access Your Profile
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
                  View upcoming villa stays, track wishlists, and manage your account details.
                </p>
              </div>
              <Button
                onClick={() => openAuthModal()}
                className="bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4 mr-1.5" /> Sign In / Register
              </Button>
            </div>
          )}
        </div>

        {/* Trips & Activity Shortcuts */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/booking"
            className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <CalendarCheck className="w-5 h-5 text-[#ff6900]" />
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-transform group-hover:translate-x-0.5" />
            </div>
            <h4 className="text-sm font-bold text-neutral-900">My Bookings</h4>
            <p className="text-xs text-neutral-500 mt-0.5">Upcoming, completed & invoices</p>
          </Link>

          <Link
            href="/wishlist"
            className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-5 h-5 text-[#ff6900]" />
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-transform group-hover:translate-x-0.5" />
            </div>
            <h4 className="text-sm font-bold text-neutral-900">Wishlist</h4>
            <p className="text-xs text-neutral-500 mt-0.5">Saved villas & cottages</p>
          </Link>
        </div>

        {/* Account Menu Items */}
        <div className="bg-white rounded-3xl p-3 sm:p-4 border border-neutral-200/90 shadow-2xs space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1 mb-1">
            Support & Policies
          </p>

          <Link
            href="/account/support"
            className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#ff6900] flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-neutral-800">
                Help & Support Center
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
          </Link>

          <Link
            href="/privacy-policy"
            className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-neutral-800">
                Privacy Policy
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
          </Link>

          <Link
            href="/terms-of-service"
            className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-neutral-800">
                Terms of Service
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
          </Link>

          <Link
            href="/cancellation-policy"
            className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center">
                <RotateCcw className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-neutral-800">
                Cancellation Guidelines
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
          </Link>

          <Link
            href="/become-host"
            className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-neutral-800">
                Become a Host
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
          </Link>
        </div>

        {/* Logout Button */}
        {isLoggedIn && (
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 border border-rose-100 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Log Out of Account
          </Button>
        )}
      </div>
    </main>
  );
}
