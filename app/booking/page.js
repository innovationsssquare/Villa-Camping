"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Search,
  Users,
  IndianRupee,
  CheckCircle2,
  XCircle,
  Clock,
  Receipt,
  Info,
  AlertCircle,
  Copy,
  Check,
  Navigation,
  Star,
  MessageSquare,
  Sparkles,
  Luggage,
  Phone,
  ArrowRight,
  ChevronRight,
  CreditCard,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Compass,
  Building,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserSidebar } from "@/components/Navbarcomponents/Sidebar";
import { NotificationSheet } from "@/components/Navbarcomponents/Notificationsheet";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBookings } from "@/Redux/Slices/myBookingSlice";
import { ReviewDrawer } from "./Review-drawer";
import { DisputeDrawer } from "./Dispute-drawer";
import { DisputeTrackerModal } from "./Dispute-tracker-modal";
import { ReservationPassModal } from "./Reservation-pass-modal";
import { GetCustomerDisputesAPI } from "@/lib/API/Dispute/Dispute";
import { addToast } from "@heroui/react";
import ButtonLoader from "@/components/Loadercomponents/button-loader";
import { getStoredUser, isUserLoggedIn } from "@/lib/auth";

/**
 * Resolves exact GPS coordinates from property or booking records.
 * Supports GeoJSON [longitude, latitude], standard [lat, lng], or { lat, lng } object.
 */
export function extractCoordinates(propertyId, booking) {
  const candidates = [
    propertyId?.coordinates,
    propertyId?.location?.coordinates,
    propertyId?.address?.coordinates,
    booking?.coordinates,
    booking?.location?.coordinates,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length >= 2) {
      const a = Number(candidate[0]);
      const b = Number(candidate[1]);
      if (!isNaN(a) && !isNaN(b) && (a !== 0 || b !== 0)) {
        if (a > 50 && b < 50) {
          return { lat: b, lng: a };
        }
        return { lat: a, lng: b };
      }
    } else if (candidate && typeof candidate === "object") {
      const lat = Number(candidate.lat ?? candidate.latitude);
      const lng = Number(candidate.lng ?? candidate.longitude);
      if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
        return { lat, lng };
      }
    } else if (typeof candidate === "string" && candidate.includes(",")) {
      const parts = candidate.split(",").map((s) => Number(s.trim()));
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        if (parts[0] > 50 && parts[1] < 50) return { lat: parts[1], lng: parts[0] };
        return { lat: parts[0], lng: parts[1] };
      }
    }
  }

  const directLat = Number(
    propertyId?.lat ?? propertyId?.latitude ?? booking?.lat ?? booking?.latitude
  );
  const directLng = Number(
    propertyId?.lng ?? propertyId?.longitude ?? booking?.lng ?? booking?.longitude
  );
  if (!isNaN(directLat) && !isNaN(directLng) && (directLat !== 0 || directLng !== 0)) {
    return { lat: directLat, lng: directLng };
  }

  return null;
}

export default function BookingScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.myBookings);

  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Tab & search filters
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Disputes & Claims state
  const [disputes, setDisputes] = useState([]);
  const [disputesLoading, setDisputesLoading] = useState(false);

  // Modals state
  const [passBooking, setPassBooking] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [initialReviewRating, setInitialReviewRating] = useState(5);
  const [disputeBooking, setDisputeBooking] = useState(null);
  const [trackDispute, setTrackDispute] = useState(null);

  // Razorpay payment state
  const [retryingBookingId, setRetryingBookingId] = useState(null);

  // Load user from localStorage / cookies
  useEffect(() => {
    const user = getStoredUser();
    if (user && (user._id || user.token)) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    } else {
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const customerId = currentUser?._id;

  // Load bookings & disputes
  const loadData = useCallback(async () => {
    if (!customerId) return;
    dispatch(fetchMyBookings(customerId));

    setDisputesLoading(true);
    try {
      const email = currentUser?.email || "";
      const res = await GetCustomerDisputesAPI(customerId, email);
      if (res?.success && Array.isArray(res.data)) {
        setDisputes(res.data);
      } else if (Array.isArray(res)) {
        setDisputes(res);
      } else {
        setDisputes([]);
      }
    } catch {
      setDisputes([]);
    } finally {
      setDisputesLoading(false);
    }
  }, [customerId, currentUser?.email, dispatch]);

  useEffect(() => {
    if (customerId) {
      loadData();
    }
  }, [customerId, loadData]);

  // Helpers
  const isCheckoutInPast = (checkOutDate) => {
    if (!checkOutDate) return false;
    return new Date(checkOutDate).getTime() < Date.now();
  };

  const getDaysCountdown = (checkInDate) => {
    if (!checkInDate) return "In 3 Days";
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(checkInDate);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays > 1) return `In ${diffDays} Days`;
    return "Checked In";
  };

  // Categorize Real Bookings (Matching Thevillacamp App)
  const allList = useMemo(() => bookings || [], [bookings]);

  const pendingBookings = useMemo(() => {
    return allList.filter((b) => {
      const s = (b.status || b.bookingStatus || "").toLowerCase();
      const p = (b.paymentStatus || "").toLowerCase();
      return (s === "pending" || p === "unpaid") && s !== "cancelled";
    });
  }, [allList]);

  const activeBookings = useMemo(() => {
    return allList.filter((b) => {
      const s = (b.status || b.bookingStatus || "").toLowerCase();
      const p = (b.paymentStatus || "").toLowerCase();
      const isPending = s === "pending" || p === "unpaid";
      const isCancelled = s === "cancelled";
      return !isCancelled && !isPending && !isCheckoutInPast(b.checkOut);
    });
  }, [allList]);

  const completedBookings = useMemo(() => {
    return allList.filter((b) => {
      const s = (b.status || b.bookingStatus || "").toLowerCase();
      const isCancelled = s === "cancelled";
      return !isCancelled && (s === "completed" || isCheckoutInPast(b.checkOut));
    });
  }, [allList]);

  const cancelledBookings = useMemo(() => {
    return allList.filter((b) => {
      const s = (b.status || "").toLowerCase();
      const bs = (b.bookingStatus || "").toLowerCase();
      return (
        s === "cancelled" ||
        bs === "cancelled" ||
        s === "cancellation_requested" ||
        Boolean(b?.cancellation?.requested)
      );
    });
  }, [allList]);

  // Tab definitions matching Thevillacamp App
  const tabs = [
    {
      id: "all",
      label: "All",
      fullTitle: "All Bookings",
      icon: Luggage,
      count: allList.length,
    },
    {
      id: "upcoming",
      label: "Upcoming",
      fullTitle: "Upcoming & Active",
      icon: Calendar,
      count: activeBookings.length,
    },
    {
      id: "pending",
      label: "Pending",
      fullTitle: "Payment Pending",
      icon: Clock,
      count: pendingBookings.length,
      hasAlert: pendingBookings.length > 0,
    },
    {
      id: "completed",
      label: "Completed",
      fullTitle: "Past Stays",
      icon: CheckCircle2,
      count: completedBookings.length,
    },
    {
      id: "cancelled",
      label: "Cancelled",
      fullTitle: "Cancelled Stays",
      icon: XCircle,
      count: cancelledBookings.length,
    },
    {
      id: "claims",
      label: "Claims",
      fullTitle: "Claims & Issues",
      icon: AlertCircle,
      count: disputes.length,
    },
  ];

  const tabMeta = {
    all: {
      title: "All Bookings",
      subtitle: "Complete overview of all your weekend getaways and reservations",
    },
    upcoming: {
      title: "Upcoming & Active Stays",
      subtitle: "Your upcoming weekend trips, check-in instructions, and directions",
    },
    pending: {
      title: "Payment Pending",
      subtitle: "Reservations awaiting payment confirmation to secure your stay dates",
    },
    completed: {
      title: "Past Stays",
      subtitle: "Completed getaways, host details, and verified reviews",
    },
    cancelled: {
      title: "Cancelled Reservations",
      subtitle: "Stays that were cancelled and refunded to your payment method",
    },
    claims: {
      title: "Claims & Support Issues",
      subtitle: "Track open claims, resolution progress, and refund status",
    },
  };

  // Filter by search query
  const getTabFilteredList = () => {
    let source = [];
    if (activeTab === "all") source = allList;
    else if (activeTab === "upcoming") source = activeBookings;
    else if (activeTab === "pending") source = pendingBookings;
    else if (activeTab === "completed") source = completedBookings;
    else if (activeTab === "cancelled") source = cancelledBookings;

    if (!searchQuery.trim()) return source;
    const q = searchQuery.toLowerCase().trim();

    return source.filter((b) => {
      const prop = b.propertyId || b.property;
      const propName =
        prop?.name ||
        prop?.campName ||
        prop?.cottageTitle ||
        prop?.hotelName ||
        b.items?.[0]?.typeName ||
        "";
      const city =
        prop?.city ||
        prop?.address?.city ||
        prop?.address?.street ||
        prop?.location?.name ||
        "";
      const code = b._id?.slice(-8).toUpperCase() || "";

      return (
        propName.toLowerCase().includes(q) ||
        city.toLowerCase().includes(q) ||
        code.toLowerCase().includes(q) ||
        b._id?.toLowerCase().includes(q)
      );
    });
  };

  const displayedBookings = getTabFilteredList();

  // Copy booking code
  const handleCopyBookingId = (e, id) => {
    e?.stopPropagation();
    if (typeof window !== "undefined" && id) {
      navigator.clipboard.writeText(id);
      addToast({
        title: "Booking ID Copied",
        description: `Booking #${id.slice(-8).toUpperCase()} copied to clipboard`,
        color: "success",
      });
    }
  };

  // Open maps directions
  const handleOpenMaps = (e, booking) => {
    e?.stopPropagation();
    const prop = booking.propertyId || booking.property;
    const coords = extractCoordinates(prop, booking);
    const propName =
      prop?.name ||
      prop?.campName ||
      prop?.cottageTitle ||
      prop?.hotelName ||
      "The Villa Camp Haven";
    const city =
      prop?.city || prop?.address?.city || prop?.address?.street || "Maharashtra, India";

    if (coords && coords.lat && coords.lng) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`,
        "_blank"
      );
    } else {
      const query = encodeURIComponent(`${propName}, ${city}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
    }
  };

  // Razorpay Retry Payment Flow
  const handleRetryPayment = async (booking) => {
    setRetryingBookingId(booking._id);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8086";
      const res = await fetch(`${apiBase}/api/v1/Booking/retry-payment/${booking._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (!data?.success) {
        addToast({
          title: "Payment Notice",
          description:
            data?.message || "Failed to initialize payment retry. The dates may no longer be available.",
          color: "danger",
        });
        loadData();
        return;
      }

      if (data.alreadyConfirmed) {
        addToast({
          title: "Already Confirmed",
          description: "This reservation is already paid and confirmed!",
          color: "success",
        });
        loadData();
        return;
      }

      const { order, razorpayKey } = data.data || {};
      const prop = booking.propertyId || booking.property;
      const propTitle =
        prop?.name ||
        prop?.campName ||
        prop?.cottageTitle ||
        prop?.hotelName ||
        "The Villa Camp";

      if (typeof window !== "undefined" && window.Razorpay && order) {
        const options = {
          key: razorpayKey || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: "INR",
          name: "THE VILLA CAMP",
          description: `Complete Booking for ${propTitle}`,
          order_id: order.id,
          handler: async function (resp) {
            try {
              const vRes = await fetch(`${apiBase}/api/v1/Booking/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpayPaymentId: resp.razorpay_payment_id,
                  razorpayOrderId: resp.razorpay_order_id,
                  razorpaySignature: resp.razorpay_signature,
                  bookingId: booking._id,
                }),
              });
              const vData = await vRes.json();
              if (vData.success) {
                addToast({
                  title: "Payment Successful! 🎉",
                  description: "Your booking is now confirmed. See you on your getaway!",
                  color: "success",
                });
                loadData();
              } else {
                addToast({
                  title: "Verification Failed",
                  description:
                    "Payment was captured, but verification is pending. Please contact support.",
                  color: "danger",
                });
                loadData();
              }
            } catch {
              addToast({
                title: "Verification Error",
                description: "Error verifying payment signature. Refreshing trips...",
                color: "danger",
              });
              loadData();
            } finally {
              setRetryingBookingId(null);
            }
          },
          prefill: {
            name: `${booking.customerDetails?.firstName || ""} ${
              booking.customerDetails?.lastName || ""
            }`.trim(),
            email: booking.customerDetails?.email || currentUser?.email || "",
            contact: booking.customerDetails?.mobile || currentUser?.phone || "",
          },
          theme: { color: "#ff6900" },
          modal: {
            ondismiss: function () {
              setRetryingBookingId(null);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else if (data.data?.paymentLink?.shortUrl) {
        window.open(data.data.paymentLink.shortUrl, "_blank");
      }
    } catch (err) {
      addToast({
        title: "Payment Error",
        description: err?.message || "Failed to connect to payment gateway. Please retry.",
        color: "danger",
      });
    } finally {
      setRetryingBookingId(null);
    }
  };

  const userInitial = (
    currentUser?.name ||
    currentUser?.firstName ||
    currentUser?.fullName ||
    "U"
  )
    .charAt(0)
    .toUpperCase();

  // ---------------------------------------------------------------------------
  // RENDER BOOKING CARD (Exact Replication of Thevillacamp App's SecondaryCard)
  // ---------------------------------------------------------------------------
  const renderBookingCard = (booking, index) => {
    const prop = booking.propertyId || booking.property;
    const propName =
      prop?.name ||
      prop?.campName ||
      prop?.cottageTitle ||
      prop?.hotelName ||
      booking.items?.[0]?.typeName ||
      "Stay Reservation";

    const images = prop?.images || [];
    const cover =
      images[0] ||
      prop?.coverImage ||
      prop?.propertyImage ||
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80";

    const city =
      prop?.city ||
      prop?.address?.city ||
      prop?.address?.street ||
      prop?.location?.name ||
      "Verified Destination";

    const statusStr = (booking.status || booking.bookingStatus || "confirmed").toLowerCase();
    const isPending =
      statusStr === "pending" || (booking.paymentStatus || "").toLowerCase() === "unpaid";
    const isCancelled = statusStr === "cancelled" || Boolean(booking?.cancellation?.cancelled);
    const isCancellationRequested =
      statusStr === "cancellation_requested" || Boolean(booking?.cancellation?.requested);
    const isCompleted =
      activeTab === "completed" ||
      statusStr === "completed" ||
      (!isCancelled && !isCancellationRequested && !isPending && isCheckoutInPast(booking.checkOut));

    const checkInFmt = booking.checkIn
      ? new Date(booking.checkIn).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Check-in";

    const checkOutFmt = booking.checkOut
      ? new Date(booking.checkOut).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Check-out";

    const nightsCount =
      booking.checkIn && booking.checkOut
        ? Math.max(
            1,
            Math.round(
              (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          )
        : 1;

    const bookingCode = booking._id?.slice(-8).toUpperCase() || `BK-${index + 1000}`;
    const daysCountdown = getDaysCountdown(booking.checkIn);

    const pricing = booking.pricing || {
      subtotal: booking.totalPrice || 0,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: booking.totalPrice || 0,
    };

    // A. Pending Payment Booking Card
    if (isPending) {
      return (
        <div
          key={booking._id}
          className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
        >
          {/* Top Row: Thumbnail + Info */}
          <div className="flex flex-row p-3 sm:p-4 gap-3.5 sm:gap-4 items-start">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-neutral-100">
              <img
                src={cover}
                alt={propName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-1.5 left-1.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-extrabold text-neutral-900 shadow-2xs truncate max-w-[85%]">
                {city.split(",")[0]}
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
              <div>
                <div className="flex items-center justify-between gap-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200/70">
                    <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                    <span>Pending Payment</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleCopyBookingId(e, booking._id)}
                    className="text-[11px] font-mono font-bold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                    title="Click to copy Booking ID"
                  >
                    #{bookingCode}
                  </button>
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-neutral-900 truncate mt-1.5 leading-snug">
                  {propName}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5 truncate">
                  {checkInFmt.split(",")[0]} – {checkOutFmt.split(",")[0]} • {nightsCount}{" "}
                  {nightsCount === 1 ? "Night" : "Nights"}
                </p>
              </div>

              <div className="flex items-end justify-between gap-2 pt-2">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Amount Due
                  </span>
                  <span className="text-sm sm:text-base font-black text-amber-600">
                    ₹{(pricing.totalAmount || 1650).toLocaleString("en-IN")}
                  </span>
                </div>

                <Button
                  type="button"
                  onClick={() => handleRetryPayment(booking)}
                  disabled={retryingBookingId === booking._id}
                  className="h-8 sm:h-9 px-3.5 rounded-xl bg-gradient-to-r from-[#ff6900] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c84d00] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  {retryingBookingId === booking._id ? (
                    <ButtonLoader />
                  ) : (
                    <>
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay Now</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Minimal Hold Banner */}
          <div className="mx-3 sm:mx-4 mb-3 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70 flex items-center gap-2 text-xs text-amber-900 font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">Dates held • Complete payment to confirm stay</span>
          </div>

          {/* Minimal Footer Row */}
          <div className="px-3 sm:px-4 pb-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPassBooking(booking)}
              className="w-full py-2.5 px-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/90 text-xs font-bold text-neutral-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5 text-neutral-600" />
              <span>View Booking Summary</span>
            </button>
          </div>
        </div>
      );
    }

    // B. Completed Stay Secondary Card (With Interactive Rate & Review Section)
    if (isCompleted) {
      return (
        <div
          key={booking._id}
          className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
        >
          {/* Top Row: Thumbnail + Info */}
          <div className="flex flex-row p-3 sm:p-4 gap-3.5 sm:gap-4 items-start">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-neutral-100">
              <img
                src={cover}
                alt={propName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-1.5 left-1.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-extrabold text-neutral-900 shadow-2xs truncate max-w-[85%]">
                {city.split(",")[0]}
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
              <div>
                <div className="flex items-center justify-between gap-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200/70">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Completed</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleCopyBookingId(e, booking._id)}
                    className="text-[11px] font-mono font-bold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                    title="Click to copy Booking ID"
                  >
                    #{bookingCode}
                  </button>
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-neutral-900 truncate mt-1.5 leading-snug">
                  {propName}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5 truncate">
                  {checkInFmt.split(",")[0]} – {checkOutFmt.split(",")[0]} • {nightsCount}{" "}
                  {nightsCount === 1 ? "Night" : "Nights"}
                </p>
              </div>

              <div className="flex items-end justify-between gap-2 pt-2">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Total Paid
                  </span>
                  <span className="text-sm sm:text-base font-black text-neutral-900">
                    ₹{(pricing.totalAmount || 890).toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setPassBooking(booking)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200/70 hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  Receipt Available
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Rate & Review Section */}
          <div className="mx-3 sm:mx-4 mb-3 p-3 sm:p-3.5 bg-neutral-50/90 rounded-2xl border border-neutral-200/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900">
                Rate & Review Your Stay
              </span>
              <span className="text-[11px] text-neutral-500">
                How was {city.split(",")[0]}?
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 sm:gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setInitialReviewRating(star);
                      setReviewBooking(booking);
                    }}
                    className="p-1 hover:scale-125 transition-transform cursor-pointer"
                    title={`Rate ${star} Stars`}
                  >
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setInitialReviewRating(5);
                  setReviewBooking(booking);
                }}
                className="py-1.5 px-3 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Write Review</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60 text-xs">
              <button
                type="button"
                onClick={() => setDisputeBooking(booking)}
                className="text-neutral-500 hover:text-neutral-900 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5 text-neutral-400" />
                <span>Report Stay Issue</span>
              </button>

              <button
                type="button"
                onClick={() => setPassBooking(booking)}
                className="text-[#ff6900] hover:underline font-bold cursor-pointer"
              >
                View Reservation
              </button>
            </div>
          </div>
        </div>
      );
    }

    // B2. Cancellation Requested Card (Under Admin Review)
    if (isCancellationRequested) {
      return (
        <div
          key={booking._id}
          className="bg-white rounded-2xl sm:rounded-3xl border border-amber-300 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
        >
          {/* Top Row: Thumbnail + Info */}
          <div className="flex flex-row p-3 sm:p-4 gap-3.5 sm:gap-4 items-start">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-neutral-100">
              <img
                src={cover}
                alt={propName}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1.5 left-1.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-extrabold text-neutral-900 shadow-2xs truncate max-w-[85%]">
                {city.split(",")[0]}
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
              <div>
                <div className="flex items-center justify-between gap-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-300/80">
                    <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                    <span>Cancellation Requested</span>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-neutral-400">
                    #{bookingCode}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-neutral-900 truncate mt-1.5 leading-snug">
                  {propName}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5 truncate">
                  {checkInFmt.split(",")[0]} – {checkOutFmt.split(",")[0]} • Review in Progress
                </p>
              </div>

              <div className="flex items-end justify-between gap-2 pt-2">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Review Status
                  </span>
                  <span className="text-xs font-bold text-amber-600">
                    Under Admin Review
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPassBooking(booking);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200/80 transition-colors cursor-pointer"
                  >
                    View Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // C. Cancelled Booking Card
    if (isCancelled) {
      const refundStatus = booking?.cancellation?.refundStatus;
      const refundAmount = booking?.cancellation?.refundAmount;

      let refundStatusLabel = "Refund Under Review";
      let refundColorClass = "text-amber-600";

      if (refundStatus === "processed") {
        refundStatusLabel = refundAmount > 0
          ? `Refund Processed (₹${Number(refundAmount).toLocaleString("en-IN")})`
          : "Refund Processed";
        refundColorClass = "text-emerald-600";
      } else if (refundStatus === "pending") {
        refundStatusLabel = refundAmount > 0
          ? `Cancellation Approved • ₹${Number(refundAmount).toLocaleString("en-IN")} Pending`
          : "Cancellation Approved • Refund Pending";
        refundColorClass = "text-blue-600";
      } else if (refundStatus === "rejected") {
        refundStatusLabel = "Cancellation Request Declined";
        refundColorClass = "text-rose-600";
      } else if (refundStatus === "non_refundable" || (!refundAmount && booking?.cancellation?.cancelled)) {
        refundStatusLabel = "Non-Refundable Cancellation";
        refundColorClass = "text-neutral-500";
      }

      return (
        <div
          key={booking._id}
          className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group opacity-90"
        >
          {/* Top Row: Thumbnail + Info */}
          <div className="flex flex-row p-3 sm:p-4 gap-3.5 sm:gap-4 items-start">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-neutral-100">
              <img
                src={cover}
                alt={propName}
                className="w-full h-full object-cover grayscale"
              />
              <div className="absolute bottom-1.5 left-1.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-extrabold text-neutral-900 shadow-2xs truncate max-w-[85%]">
                {city.split(",")[0]}
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
              <div>
                <div className="flex items-center justify-between gap-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200/70">
                    <XCircle className="w-3 h-3 text-rose-600" />
                    <span>Cancelled</span>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-neutral-400">
                    #{bookingCode}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-neutral-900 truncate mt-1.5 leading-snug">
                  {propName}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5 truncate">
                  {checkInFmt.split(",")[0]} – {checkOutFmt.split(",")[0]} • Cancelled
                </p>
              </div>

              <div className="flex items-end justify-between gap-2 pt-2">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Refund Status
                  </span>
                  <span className={`text-xs font-bold ${refundColorClass}`}>
                    {refundStatusLabel}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPassBooking(booking);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/category/villa");
                    }}
                    className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#ff6900] text-xs font-bold border border-orange-200/80 transition-colors cursor-pointer"
                  >
                    Book Similar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // D. Upcoming & Confirmed Card (Default Active Stay)
    return (
      <div
        key={booking._id}
        className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
      >
        {/* Top Row: Thumbnail + Info */}
        <div className="flex flex-row p-3 sm:p-4 gap-3.5 sm:gap-4 items-start">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-neutral-100">
            <img
              src={cover}
              alt={propName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-1.5 left-1.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-extrabold text-neutral-900 shadow-2xs truncate max-w-[85%]">
              {city.split(",")[0]}
            </div>
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
            <div>
              <div className="flex items-center justify-between gap-1.5">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200/70">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Confirmed</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleCopyBookingId(e, booking._id)}
                  className="text-[11px] font-mono font-bold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                  title="Click to copy Booking ID"
                >
                  #{bookingCode}
                </button>
              </div>

              <h3 className="text-sm sm:text-base font-extrabold text-neutral-900 truncate mt-1.5 leading-snug">
                {propName}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5 truncate">
                {checkInFmt.split(",")[0]} – {checkOutFmt.split(",")[0]} • {nightsCount}{" "}
                {nightsCount === 1 ? "Night" : "Nights"}
              </p>
            </div>

            <div className="flex items-end justify-between gap-2 pt-2">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Total Paid
                </span>
                <span className="text-sm sm:text-base font-black text-neutral-900">
                  ₹{(pricing.totalAmount || 1240).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-[#ff6900] text-[11px] font-bold border border-orange-200/70">
                <Clock className="w-3 h-3" />
                <span>{daysCountdown}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Footer Action Buttons */}
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={(e) => handleOpenMaps(e, booking)}
            className="h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200/90 text-neutral-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-neutral-700" />
            <span>Directions</span>
          </button>

          <button
            type="button"
            onClick={() => setPassBooking(booking)}
            className="h-10 rounded-xl bg-[#ff6900] hover:bg-[#ea580c] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // MAIN RENDER
  // ---------------------------------------------------------------------------
  return (
    <main className="min-h-screen bg-[#F4F6FB] pb-28 pt-0 md:pt-20 text-neutral-900">
      {/* 1. Mobile Top Header (Minimal & Sleek, Matching Thevillacamp App) */}
      <section className="w-full sticky top-0 bg-[#F4F6FB]/95 backdrop-blur-md px-4 pt-3 pb-2.5 z-40 md:hidden flex items-center justify-between border-b border-neutral-200/60 shadow-2xs">
        <div className="flex items-center gap-2">
          <UserSidebar />
          <div className="w-7 h-7 rounded-lg bg-[#FFF7ED] flex items-center justify-center text-[#ff6900] shrink-0">
            <Luggage className="w-4 h-4" />
          </div>
          <h1 className="text-lg font-black text-neutral-900 tracking-tight">
            My Bookings
          </h1>
          <span className="px-2 py-0.5 rounded-lg bg-neutral-200 text-neutral-700 text-[11px] font-bold">
            {isAuthenticated ? `${allList.length} Total` : "Guest"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <NotificationSheet />
          <button
            type="button"
            onClick={() => (isAuthenticated ? router.push("/account") : router.push("/Signin"))}
            className="w-8 h-8 rounded-full bg-[#ff6900] text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-2xs"
          >
            {userInitial}
          </button>
        </div>
      </section>

      {/* Main Container: 2-Column Responsive Layout for Desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Top Header Bar on Desktop & Tablet */}
        <div className="hidden md:flex items-center justify-between pb-5 border-b border-neutral-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-2">
              <Link href="/" className="hover:text-neutral-900 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-neutral-800 font-semibold">My Bookings</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF7ED] flex items-center justify-center text-[#ff6900] shrink-0 shadow-2xs border border-orange-100">
                <Luggage className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                    My Bookings
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-neutral-200/90 text-neutral-700 text-xs font-bold">
                    {isAuthenticated ? `${allList.length} Total Stays` : "Guest"}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Manage reservations, check-in passes, disputes & concierge assistance
                </p>
              </div>
            </div>
          </div>

          {/* Quick Search on Desktop */}
          {isAuthenticated && (
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Search stays, cities, codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-9 rounded-2xl bg-white border border-neutral-200/90 text-xs font-semibold placeholder-neutral-400 focus:outline-none focus:border-[#ff6900] focus:ring-2 focus:ring-[#ff6900]/15 shadow-2xs transition-all"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="w-5 h-5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 absolute right-3 top-1/2 -translate-y-1/2 text-xs flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        {/* 2-Column Responsive Body */}
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 mt-4 sm:mt-6">
          {/* ================================================================= */}
          {/* LEFT COLUMN: ACTIONS & NAVIGATION SIDEBAR (DESKTOP ONLY, HIDDEN ON MOBILE) */}
          {/* ================================================================= */}
          <aside className="hidden lg:block lg:w-80 shrink-0 space-y-4 lg:sticky lg:top-24">
            {/* 1. Traveler Profile Card */}
            {isAuthenticated && (
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/80 shadow-2xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ff6900] to-[#ff8c38] text-white font-black text-lg flex items-center justify-center shadow-xs shrink-0 ring-4 ring-orange-50">
                    {userInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-extrabold text-neutral-900 truncate">
                        {currentUser?.name ||
                          currentUser?.fullName ||
                          currentUser?.firstName ||
                          "Traveler"}
                      </h3>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Verified Guest" />
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate">
                      {currentUser?.email || currentUser?.mobile || "Thevillacamp Member"}
                    </p>
                    <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Verified Guest</span>
                    </div>
                  </div>
                </div>

                {/* Quick Trip Stats Counters */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-neutral-100 text-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab("all")}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      activeTab === "all" ? "bg-orange-50 text-[#ff6900]" : "hover:bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    <span className="block text-base font-black text-neutral-900 leading-none">
                      {allList.length}
                    </span>
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mt-1 block">
                      Total
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("upcoming")}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      activeTab === "upcoming" ? "bg-orange-50 text-[#ff6900]" : "hover:bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    <span className="block text-base font-black text-neutral-900 leading-none">
                      {activeBookings.length}
                    </span>
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mt-1 block">
                      Active
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("completed")}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      activeTab === "completed" ? "bg-orange-50 text-[#ff6900]" : "hover:bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    <span className="block text-base font-black text-neutral-900 leading-none">
                      {completedBookings.length}
                    </span>
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mt-1 block">
                      Past
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. Vertical Tab Navigation (Desktop Only) */}
            {isAuthenticated && (
              <div className="hidden lg:block bg-white rounded-3xl p-3 border border-neutral-200/80 shadow-2xs space-y-1">
                <div className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                  <span>Filter Stays</span>
                  <span className="text-[10px] text-neutral-400 font-bold">{allList.length} total</span>
                </div>

                <div className="space-y-1">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const IconComp = tab.icon;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between select-none ${
                          isActive
                            ? "bg-[#ff6900] text-white shadow-xs"
                            : tab.hasAlert
                            ? "bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100"
                            : "hover:bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComp
                            className={`w-4 h-4 ${
                              isActive ? "text-white" : tab.hasAlert ? "text-amber-700" : "text-neutral-500"
                            }`}
                          />
                          <span>{tab.fullTitle || tab.label}</span>
                        </div>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                            isActive
                              ? "bg-white/25 text-white"
                              : tab.hasAlert
                              ? "bg-amber-200 text-amber-900"
                              : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Action Sidebar Card: Concierge, WhatsApp, Search & Policies */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/80 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-orange-50 text-[#ff6900] flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                    Trip Actions
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-neutral-400">Concierge Desk</span>
              </div>

              <div className="space-y-2">
                {/* Action 1: Call Concierge */}
                <a
                  href="tel:+918669186483"
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-neutral-50 hover:bg-orange-50/70 border border-neutral-200/60 hover:border-orange-200 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-orange-100/70 text-[#ff6900] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-neutral-900 truncate">
                        Call Concierge Support
                      </div>
                      <div className="text-[10px] text-neutral-500 truncate">
                        +91 86691 86483 • 24/7 Helpline
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white text-[10px] font-extrabold text-[#ff6900] border border-orange-200 shrink-0 shadow-2xs">
                    Call
                  </span>
                </a>

                {/* Action 2: WhatsApp VIP Support */}
                <a
                  href="https://wa.me/918669186483?text=Hi%20Thevillacamp%2C%20I%20need%20assistance%20with%20my%20reservation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-neutral-50 hover:bg-emerald-50/70 border border-neutral-200/60 hover:border-emerald-200 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-neutral-900 truncate">
                        WhatsApp VIP Support
                      </div>
                      <div className="text-[10px] text-neutral-500 truncate">
                        Instant chat for stays & help
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold shrink-0 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>Live</span>
                  </div>
                </a>

                {/* Action 3: Explore Stays */}
                <Link
                  href="/category/villa"
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-neutral-200/80 text-neutral-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-neutral-900 truncate">
                        Book Another Stay
                      </div>
                      <div className="text-[10px] text-neutral-500 truncate">
                        Explore verified villas & camps
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                </Link>

                {/* Action 4: Curated Experiences */}
                <Link
                  href="/experiences"
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-neutral-900 truncate">
                        Local Experiences
                      </div>
                      <div className="text-[10px] text-neutral-500 truncate">
                        Waterfalls, trails & campfires
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                </Link>

                {/* Action 5: Cancellation Policy */}
                <Link
                  href="/cancellation-policy"
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-neutral-200/80 text-neutral-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-neutral-900 truncate">
                        Cancellation Policy
                      </div>
                      <div className="text-[10px] text-neutral-500 truncate">
                        Transparent refund schedules
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>
            </div>

            {/* 4. Trust / Safe Booking Assurance */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-4 text-white shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-[#FFD166]">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-wider">
                  Thevillacamp Guarantee
                </span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                All stays are 100% verified on-ground with digital check-in passes and 24/7 caretaker assistance.
              </p>
            </div>
          </aside>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: CARDS & CONTENT (KEPT ON THE RIGHT SIDE) */}
          {/* ================================================================= */}
          <section className="flex-1 min-w-0 w-full space-y-4">
            {/* Mobile Tab Slider (< lg only, Matching Thevillacamp App) */}
            {isAuthenticated && (
              <div className="lg:hidden w-full bg-white rounded-2xl p-2 border border-neutral-200/80 shadow-2xs overflow-x-auto flex items-center gap-2 no-scrollbar [scrollbar-width:none]">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const IconComp = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 select-none ${
                        isActive
                          ? "bg-[#ff6900] text-white shadow-xs"
                          : tab.hasAlert
                          ? "bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100"
                          : "bg-neutral-100/90 hover:bg-neutral-200/80 text-neutral-700"
                      }`}
                    >
                      <IconComp className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-neutral-600"}`} />
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                          isActive ? "bg-white/25 text-white" : "bg-white text-neutral-600 shadow-2xs"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tab Subtitle Header & Filter Feedback */}
            {isAuthenticated && tabMeta[activeTab] && (
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-neutral-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
                      {tabMeta[activeTab].title}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-extrabold border border-neutral-200/70">
                      {displayedBookings.length} {displayedBookings.length === 1 ? "stay" : "stays"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {tabMeta[activeTab].subtitle}
                  </p>
                </div>

                {searchQuery && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-[#ff6900] text-xs font-bold self-start sm:self-auto">
                    <span>Filtering: "{searchQuery}"</span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="hover:text-neutral-900 font-extrabold ml-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab Content: Unauthenticated Prompt or Bookings List */}
            {!isAuthenticated ? (
              /* Unauthenticated Prompt */
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/90 shadow-2xs text-center max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6900] mx-auto shadow-xs">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-neutral-900">
                  Log In to View Your Bookings
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto">
                  Sign in to view your stay reservations, download check-in passes, and track booking
                  status in real time.
                </p>

                <div className="space-y-2 pt-2">
                  <Button
                    type="button"
                    onClick={() => router.push("/Signin")}
                    className="w-full h-11 rounded-xl bg-[#ff6900] hover:bg-[#ea580c] text-white font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    Log In / Register
                  </Button>

                  <Button
                    type="button"
                    onClick={() => router.push("/")}
                    className="w-full h-11 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Explore Verified Stays
                  </Button>
                </div>
              </div>
            ) : loading ? (
              /* Skeleton Loader */
              <div className="space-y-3.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl p-4 border border-neutral-200/80 animate-pulse flex flex-row gap-4"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-neutral-200 shrink-0" />
                    <div className="flex-1 space-y-2.5 py-1">
                      <div className="w-24 h-4 bg-neutral-200 rounded-md" />
                      <div className="w-48 h-5 bg-neutral-200 rounded-md" />
                      <div className="w-32 h-3 bg-neutral-100 rounded-md" />
                      <div className="w-20 h-4 bg-neutral-200 rounded-md mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activeTab === "claims" ? (
              /* Claims & Disputes Tab */
              <div className="space-y-3">
                {disputes.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 border border-neutral-200/90 shadow-2xs text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-extrabold text-neutral-900">
                      No claims or disputes
                    </h3>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                      You have not raised any issues. We're glad your getaways have been flawless!
                    </p>
                  </div>
                ) : (
                  disputes.map((d) => {
                    const status = (d.status || "OPEN").toUpperCase();
                    const isResolved = status === "RESOLVED";

                    return (
                      <div
                        key={d._id}
                        className="bg-white rounded-2xl sm:rounded-3xl p-4 border border-neutral-200/90 shadow-2xs hover:shadow-md transition-all space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <span className="text-xs font-bold text-neutral-900 font-mono">
                              Claim #{d._id?.slice(-8).toUpperCase()}
                            </span>
                            <div className="text-[11px] text-neutral-500 font-medium">
                              {d.issueCategory}
                            </div>
                          </div>

                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                              isResolved
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {status}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-700 leading-relaxed line-clamp-3">
                          {d.description}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                          <span className="text-neutral-400 text-[11px]">
                            Filed on{" "}
                            {new Date(d.createdAt).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>

                          <button
                            type="button"
                            onClick={() => setTrackDispute(d)}
                            className="py-1.5 px-3 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>Track Progress</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : displayedBookings.length === 0 ? (
              /* Empty Bookings State */
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200/90 shadow-2xs text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-500 mx-auto">
                  <Luggage className="w-7 h-7 text-[#ff6900]" />
                </div>
                <h3 className="text-base font-extrabold text-neutral-900">
                  No {activeTab !== "all" ? activeTab : ""} bookings found
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  {searchQuery
                    ? `No reservations matching "${searchQuery}". Try searching another name or area.`
                    : "You don't have any bookings in this section yet. Explore our luxury stays to plan your next weekend trip!"}
                </p>
                <div className="pt-2">
                  <Button
                    type="button"
                    onClick={() => router.push("/category/villa")}
                    className="py-2.5 px-5 rounded-xl bg-[#ff6900] hover:bg-[#ea580c] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Explore Verified Stays
                  </Button>
                </div>
              </div>
            ) : (
              /* Rendered Cards */
              <div className="space-y-3.5">
                {displayedBookings.map((item, idx) => renderBookingCard(item, idx))}
              </div>
            )}

            {/* Neighborhood Experiences Banner (Matching Thevillacamp App) */}
            {(activeTab === "all" || activeTab === "upcoming") && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2 px-1">
                  <h3 className="text-sm font-extrabold text-neutral-900">
                    Explore Local Experiences
                  </h3>
                  <Link
                    href="/experiences"
                    className="text-xs font-bold text-[#ff6900] hover:underline"
                  >
                    Curated Guides →
                  </Link>
                </div>

                <Link href="/experiences" className="block group">
                  <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-xs h-44 sm:h-52">
                    <img
                      src="/Aboutusasset/Villabanner.jpg"
                      alt="Curated Experiences"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-slate-950/25" />

                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#FFD166] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                      <Sparkles className="w-3 h-3" />
                      <span>Curated Experiences</span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="text-sm sm:text-base font-extrabold text-white truncate drop-shadow-sm">
                          Sahyadri Trails, Waterfalls & Campfires
                        </h4>
                        <p className="text-xs text-neutral-200 mt-0.5 line-clamp-1">
                          Explore handpicked local activities & scenic viewpoints near your stay
                        </p>
                      </div>

                      <span className="shrink-0 py-2 px-3.5 rounded-xl bg-white text-neutral-900 text-xs font-bold flex items-center gap-1.5 shadow-sm group-hover:bg-orange-50 transition-colors">
                        <Compass className="w-3.5 h-3.5 text-[#ff6900]" />
                        <span>Browse 25+ Experiences</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* 6. Modals */}
      {/* Reservation Pass Modal */}
      <ReservationPassModal
        isOpen={Boolean(passBooking)}
        booking={passBooking}
        onClose={() => setPassBooking(null)}
        onPayNow={(b) => handleRetryPayment(b)}
        onRefresh={loadData}
      />

      {/* Review Drawer */}
      <ReviewDrawer
        isOpen={Boolean(reviewBooking)}
        booking={reviewBooking}
        initialRating={initialReviewRating}
        onClose={() => setReviewBooking(null)}
        onSuccess={loadData}
      />

      {/* Dispute Drawer */}
      <DisputeDrawer
        isOpen={Boolean(disputeBooking)}
        booking={disputeBooking}
        onClose={() => setDisputeBooking(null)}
        onSuccess={loadData}
      />

      {/* Dispute Tracker Modal */}
      <DisputeTrackerModal
        isOpen={Boolean(trackDispute)}
        dispute={trackDispute}
        onClose={() => setTrackDispute(null)}
      />
    </main>
  );
}
