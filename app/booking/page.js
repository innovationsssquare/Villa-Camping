"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
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
  ShieldAlert,
  Compass,
  Copy,
  Check,
  Navigation,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CreditCard,
  ExternalLink,
  Luggage,
  ShieldCheck,
  Phone,
  HelpCircle,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserSidebar } from "@/components/Navbarcomponents/Sidebar";
import { NotificationSheet } from "@/components/Navbarcomponents/Notificationsheet";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBookings } from "@/Redux/Slices/myBookingSlice";
import { ReviewDrawer } from "./Review-drawer";
import { DisputeDrawer } from "./Dispute-drawer";
import { GetCustomerDisputesAPI } from "@/lib/API/Dispute/Dispute";
import ButtonLoader from "@/components/Loadercomponents/button-loader";
import { addToast } from "@heroui/react";

const StatusBadge = ({ status, isPastStay }) => {
  const s = (status || "confirmed").toLowerCase();
  if (isPastStay && (s === "pending" || s === "unpaid")) {
    return (
      <Badge className="bg-rose-50/95 backdrop-blur-md text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
        <XCircle className="w-3 h-3 text-rose-600" />
        Dates Expired
      </Badge>
    );
  }
  if (s === "booked" || s === "confirmed") {
    return (
      <Badge className="bg-emerald-500/90 backdrop-blur-md text-white border-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        Confirmed
      </Badge>
    );
  }
  if (s === "completed") {
    return (
      <Badge className="bg-neutral-900/80 backdrop-blur-md text-white border-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3 text-neutral-300" />
        Completed
      </Badge>
    );
  }
  if (s === "cancelled") {
    return (
      <Badge className="bg-rose-500/90 backdrop-blur-md text-white border-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
        <XCircle className="w-3 h-3 text-white" />
        Cancelled
      </Badge>
    );
  }
  if (s === "pending") {
    return (
      <Badge className="bg-amber-500/95 backdrop-blur-md text-white border-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
        <Clock className="w-3 h-3 text-white animate-pulse" />
        Payment Pending
      </Badge>
    );
  }
  return (
    <Badge className="bg-neutral-800/80 backdrop-blur-md text-white border-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
      <Clock className="w-3 h-3 text-neutral-300" />
      {status || "Pending"}
    </Badge>
  );
};

const BookingCard = ({
  booking,
  onWriteReview,
  onRaiseDispute,
  onPaymentSuccess,
}) => {
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  const {
    propertyId,
    checkIn,
    checkOut,
    status,
    paymentStatus,
    pricing,
    _id,
    items,
    holdExpiresAt,
    paymentLink,
  } = booking;

  const isPending =
    (status || "").toLowerCase() === "pending" ||
    (paymentStatus || "").toLowerCase() === "unpaid";

  const isPastStay = useMemo(() => {
    if (!checkIn) return false;
    const checkInDate = new Date(checkIn);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkInDate.getTime() < today.getTime();
  }, [checkIn]);

  useEffect(() => {
    if (!isPending || !holdExpiresAt) return;

    const updateTimer = () => {
      const diff = new Date(holdExpiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expired");
        setIsExpired(true);
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}m ${secs < 10 ? "0" : ""}${secs}s`);
        setIsExpired(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isPending, holdExpiresAt]);

  const propertyName =
    propertyId?.name ||
    propertyId?.campName ||
    propertyId?.cottageTitle ||
    propertyId?.hotelName ||
    items?.[0]?.typeName ||
    (booking?.propertyType ? `${booking.propertyType} Stay` : "Luxury Stay");

  const locationText = useMemo(() => {
    if (typeof propertyId?.location === "object" && propertyId?.location) {
      const parts = [propertyId.location.name, propertyId.location.city].filter(Boolean);
      if (parts.length > 0) return parts.join(", ");
    }
    if (propertyId?.city && typeof propertyId.city === "string") {
      return propertyId.city;
    }
    if (
      propertyId?.address &&
      typeof propertyId.address === "string" &&
      !/^[0-9a-fA-F]{24}$/.test(propertyId.address)
    ) {
      return propertyId.address;
    }
    if (
      propertyId?.location &&
      typeof propertyId.location === "string" &&
      !/^[0-9a-fA-F]{24}$/.test(propertyId.location)
    ) {
      return propertyId.location;
    }
    return "Maharashtra, India";
  }, [propertyId]);

  const images = propertyId?.images || [];
  const coverImage =
    images[0] ||
    propertyId?.coverImage ||
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&auto=format&fit=crop&q=80";

  const formattedCheckIn = checkIn
    ? new Date(checkIn).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
    : "N/A";

  const formattedCheckOut = checkOut
    ? new Date(checkOut).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
    : "N/A";

  const nights =
    checkIn && checkOut
      ? Math.max(
        1,
        Math.ceil(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
          (1000 * 60 * 60 * 24)
        )
      )
      : 1;

  const pricingDetails = pricing || {
    subtotal: 0,
    taxAmount: 0,
    totalAmount: 0,
    discountAmount: 0,
  };

  const bookingCode = _id ? _id.slice(-8).toUpperCase() : "TVC";

  const handleCopyId = (e) => {
    e?.stopPropagation();
    if (typeof window !== "undefined" && _id) {
      navigator.clipboard.writeText(_id);
      setCopiedId(true);
      addToast({
        title: "Booking ID Copied",
        description: `Booking #${bookingCode} copied to clipboard`,
        color: "success",
      });
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleCopyPaymentLink = () => {
    const url = paymentLink?.shortUrl;
    if (url && typeof window !== "undefined") {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      addToast({
        title: "Payment Link Copied! 📋",
        description: "You can open or share this link to complete the payment.",
        color: "success",
      });
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleRetryPayment = async () => {
    setRetrying(true);
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8086";
      const res = await fetch(
        `${apiBase}/api/v1/Booking/retry-payment/${_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();

      if (!data?.success) {
        addToast({
          title: "Cannot Complete Payment",
          description: data?.message || "Failed to initialize payment retry.",
          color: "danger",
        });
        setRetrying(false);
        onPaymentSuccess && onPaymentSuccess();
        return;
      }

      if (data.alreadyConfirmed) {
        addToast({
          title: "Booking Already Confirmed",
          description: "This reservation is already paid and confirmed!",
          color: "success",
        });
        onPaymentSuccess && onPaymentSuccess();
        setRetrying(false);
        return;
      }

      const { order, razorpayKey } = data.data || {};

      if (typeof window !== "undefined" && window.Razorpay && order) {
        const options = {
          key: razorpayKey || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: "INR",
          name: "THE VILLA CAMP",
          description: `Complete Booking for ${propertyName}`,
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
                  bookingId: _id,
                }),
              });
              const vData = await vRes.json();
              if (vData.success) {
                addToast({
                  title: "Payment Successful! 🎉",
                  description:
                    "Your booking is now confirmed. See you on your getaway!",
                  color: "success",
                  duration: 5000,
                });
                onPaymentSuccess && onPaymentSuccess();
              } else {
                addToast({
                  title: "Verification Failed",
                  description:
                    "Payment was captured, but verification is pending. Please contact support.",
                  color: "danger",
                });
              }
            } catch (err) {
              console.error("Verification error:", err);
            } finally {
              setRetrying(false);
            }
          },
          prefill: {
            name: `${booking.customerDetails?.firstName || ""} ${booking.customerDetails?.lastName || ""
              }`.trim(),
            email: booking.customerDetails?.email || "",
            contact: booking.customerDetails?.mobile || "",
          },
          theme: { color: "#ff6900" },
          modal: {
            ondismiss: function () {
              setRetrying(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else if (data.data?.paymentLink?.shortUrl) {
        window.open(data.data.paymentLink.shortUrl, "_blank");
        setRetrying(false);
      }
    } catch (err) {
      console.error("Retry payment error:", err);
      addToast({
        title: "Connection Error",
        description: "Failed to connect to payment gateway. Please try again.",
        color: "danger",
      });
      setRetrying(false);
    }
  };

  const handleOpenMaps = () => {
    const query = encodeURIComponent(`${propertyName}, ${locationText}`);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  const isCompleted = (status || "").toLowerCase() === "completed";
  const propertyCategory = (booking?.propertyType || "Stay").toUpperCase();

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl border border-neutral-200/90 hover:border-[#ff6900]/40 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col md:flex-row group">
      {/* 1. Left Image Section (Desktop: ~38% width, matching /category property card) */}
      <div className="relative w-full md:w-[38%] lg:w-[36%] h-52 md:h-80 min-h-[220px] md:min-h-[250px] bg-neutral-900 shrink-0 overflow-hidden">
        <img
          src={coverImage}
          alt={propertyName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35" />

        {/* Top Badges Row */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <StatusBadge status={status} isPastStay={isPastStay} />

          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20 shadow-2xs">
              {propertyCategory}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-neutral-900 backdrop-blur-md shadow-2xs">
              {nights} {nights === 1 ? "Night" : "Nights"}
            </span>
          </div>
        </div>

        {/* Bottom Property Title & Location Over Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 text-white z-10">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-extrabold tracking-tight truncate drop-shadow-sm text-white">
              {propertyName}
            </h3>
            <div className="flex items-center gap-1 text-xs text-neutral-200 mt-0.5 truncate">
              <MapPin className="w-3 h-3 text-[#ff6900] shrink-0" />
              <span className="truncate text-[11px]">{locationText}</span>
            </div>
          </div>

          <button
            onClick={handleCopyId}
            className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-2 py-1 rounded-md border border-white/20 transition-all cursor-pointer shrink-0 shadow-2xs"
            title="Click to copy full Booking ID"
          >
            <span>#{bookingCode}</span>
            {copiedId ? (
              <Check className="w-2.5 h-2.5 text-emerald-400" />
            ) : (
              <Copy className="w-2.5 h-2.5 text-neutral-300" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Right Content Section */}
      <div className="flex-1 p-4 sm:p-5 lg:p-6 flex flex-col justify-between space-y-4">
        {/* Pending Hold Alert Banner */}
        {isPending && (
          <div
            className={cn(
              "p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs shadow-2xs",
              isPastStay
                ? "bg-rose-50 border-rose-200 text-rose-900"
                : "bg-amber-50 border-amber-200 text-amber-900"
            )}
          >
            <div className="flex items-center gap-1.5 font-medium truncate">
              {isPastStay ? (
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-pulse" />
              )}
              <span className="truncate">
                {isPastStay
                  ? "Stay dates have passed. Payment no longer accepted."
                  : isExpired
                    ? "Hold period expired. Please retry to get fresh payment order."
                    : "Dates held! Complete payment before timer expires."}
              </span>
            </div>
            {!isPastStay && timeLeft && (
              <span className="font-mono font-bold text-amber-700 shrink-0 bg-amber-100/80 px-2 py-0.5 rounded-md text-[11px]">
                {timeLeft}
              </span>
            )}
          </div>
        )}

        {/* Check-In / Check-Out Strip */}
        <div className="grid grid-cols-2 gap-3 bg-neutral-50/80 p-3 sm:p-3.5 rounded-2xl border border-neutral-200/70">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Check-In
            </span>
            <div className="text-xs sm:text-sm font-extrabold text-neutral-900 mt-0.5">
              {formattedCheckIn}
            </div>
            <span className="text-[11px] text-neutral-500 block">After 2:00 PM</span>
          </div>

          <div className="border-l border-neutral-200/80 pl-3 sm:pl-4">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Check-Out
            </span>
            <div className="text-xs sm:text-sm font-extrabold text-neutral-900 mt-0.5">
              {formattedCheckOut}
            </div>
            <span className="text-[11px] text-neutral-500 block">By 11:00 AM</span>
          </div>
        </div>

        {/* Pricing Summary & Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-neutral-150">
          <div>
            <span className="text-[10px] font-medium text-neutral-400 block uppercase tracking-wider">
              {isPending ? "Amount Due" : "Total Paid"}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-neutral-950">
                ₹{pricingDetails.totalAmount?.toLocaleString("en-IN")}
              </span>
              <button
                type="button"
                onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                className="text-[11px] font-semibold text-[#ff6900] hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>{showPriceBreakdown ? "Hide" : "Details"}</span>
                {showPriceBreakdown ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          {isPending ? (
            <div className="flex items-center gap-1.5 shrink-0">
              {!isPastStay && (
                <>
                  <Button
                    size="sm"
                    onClick={handleRetryPayment}
                    disabled={retrying}
                    className="rounded-xl text-xs font-bold bg-[#ff6900] hover:bg-[#e05d00] text-white gap-1.5 h-8 sm:h-9 px-3.5 cursor-pointer shadow-xs"
                  >
                    {retrying ? (
                      <ButtonLoader />
                    ) : (
                      <CreditCard className="w-3.5 h-3.5" />
                    )}
                    <span>Pay Now</span>
                  </Button>

                  {paymentLink?.shortUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyPaymentLink}
                      className="rounded-xl text-xs font-semibold text-neutral-700 border-neutral-200 hover:bg-neutral-100 h-8 sm:h-9 px-2.5 cursor-pointer"
                      title="Copy Payment Link"
                    >
                      {copiedLink ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#ff6900]" />
                      )}
                    </Button>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenMaps}
                className="rounded-xl text-xs font-semibold text-neutral-700 border-neutral-200 hover:bg-neutral-100 gap-1.5 h-8 sm:h-9 px-3 cursor-pointer"
                title="Open location on Google Maps"
              >
                <Navigation className="w-3 h-3 text-[#ff6900]" />
                <span>Directions</span>
              </Button>

              {isCompleted && (
                <Button
                  size="sm"
                  onClick={() => onWriteReview && onWriteReview(booking)}
                  className="rounded-xl text-xs font-semibold bg-[#ff6900] hover:bg-[#e05d00] text-white gap-1 h-8 sm:h-9 px-3 cursor-pointer shadow-2xs"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Review</span>
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => onRaiseDispute && onRaiseDispute(booking)}
                className="rounded-xl text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50 gap-1 h-8 sm:h-9 px-2.5 cursor-pointer"
                title="Report an issue with this stay"
              >
                <AlertCircle className="w-3 h-3" />
                <span>Issue</span>
              </Button>
            </div>
          )}
        </div>

        {/* Expandable Price Breakdown */}
        {showPriceBreakdown && (
          <div className="pt-2 border-t border-neutral-150 text-xs space-y-1 bg-orange-50/40 p-2.5 rounded-xl border border-orange-200/50 animate-in fade-in-50 duration-200">
            <div className="flex justify-between text-neutral-600">
              <span>Base Stay ({nights}N)</span>
              <span className="font-semibold text-neutral-800">
                ₹{pricingDetails.subtotal?.toLocaleString("en-IN")}
              </span>
            </div>
            {pricingDetails.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span>
                <span>-₹{pricingDetails.discountAmount?.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Taxes & Fees</span>
              <span className="font-semibold text-neutral-800">
                ₹{pricingDetails.taxAmount?.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="pt-1 border-t border-orange-200 flex justify-between font-bold text-neutral-950">
              <span>Total</span>
              <span>₹{pricingDetails.totalAmount?.toLocaleString("en-IN")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function BookingScreen() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.myBookings);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [reviewDrawerOpen, setReviewDrawerOpen] = useState(false);
  const [disputeDrawerOpen, setDisputeDrawerOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [selectedBookingForDispute, setSelectedBookingForDispute] = useState(null);
  const [customerDisputes, setCustomerDisputes] = useState([]);
  const [disputesLoading, setDisputesLoading] = useState(false);

  const getCustomerId = () => {
    try {
      if (typeof window === "undefined") return null;
      return (
        localStorage.getItem("thevilla_user_id") ||
        localStorage.getItem("customer_id") ||
        null
      );
    } catch {
      return null;
    }
  };

  const customerId = getCustomerId();

  const loadCustomerDisputes = async (cId) => {
    const id = cId || customerId;
    if (!id) return;
    setDisputesLoading(true);
    try {
      let email = "";
      try {
        const storedUser = localStorage.getItem("thevilla_user");
        if (storedUser) {
          const u = JSON.parse(storedUser);
          email = u?.email || "";
        }
      } catch { }
      const res = await GetCustomerDisputesAPI(id, email);
      if (res?.success) {
        setCustomerDisputes(res.data || []);
      }
    } catch (e) {
      console.error("Failed to load customer disputes:", e);
    } finally {
      setDisputesLoading(false);
    }
  };

  useEffect(() => {
    if (!customerId) return;
    dispatch(fetchMyBookings(customerId));
    loadCustomerDisputes(customerId);
  }, [dispatch, customerId]);

  const handleWriteReview = (booking) => {
    setSelectedBookingForReview(booking);
    setReviewDrawerOpen(true);
  };

  const handleRaiseDispute = (booking) => {
    setSelectedBookingForDispute(booking);
    setDisputeDrawerOpen(true);
  };

  const isCompletedByCheckout = (checkOut) => {
    if (!checkOut) return false;
    return new Date(checkOut) < new Date();
  };

  const isActiveByCheckout = (checkOut) => {
    if (!checkOut) return false;
    return new Date(checkOut) >= new Date();
  };

  const pendingBookings = useMemo(() => {
    return (bookings || []).filter(
      (b) =>
        (b.status || "").toLowerCase() === "pending" ||
        (b.paymentStatus || "").toLowerCase() === "unpaid"
    );
  }, [bookings]);

  const activeBookings = useMemo(() => {
    return (bookings || []).filter((b) => {
      const s = (b.status || "").toLowerCase();
      return (s === "confirmed" || s === "booked") && isActiveByCheckout(b.checkOut);
    });
  }, [bookings]);

  const pastBookings = useMemo(() => {
    return (bookings || []).filter((b) => {
      const s = (b.status || "").toLowerCase();
      return (
        s === "completed" ||
        ((s === "confirmed" || s === "booked") && isCompletedByCheckout(b.checkOut))
      );
    });
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const q = search.toLowerCase().trim();
    return (bookings || []).filter((b) => {
      const prop = b.propertyId;
      const matchesSearch =
        !q ||
        b._id?.toLowerCase().includes(q) ||
        b.status?.toLowerCase().includes(q) ||
        prop?.name?.toLowerCase().includes(q) ||
        prop?.campName?.toLowerCase().includes(q) ||
        prop?.cottageTitle?.toLowerCase().includes(q) ||
        prop?.hotelName?.toLowerCase().includes(q) ||
        prop?.city?.toLowerCase().includes(q) ||
        prop?.location?.name?.toLowerCase().includes(q) ||
        b.customerDetails?.firstName?.toLowerCase().includes(q);

      const isCompleted = isCompletedByCheckout(b.checkOut);
      const isActive = isActiveByCheckout(b.checkOut);

      if (activeTab === "pending")
        return (
          matchesSearch &&
          ((b.status || "").toLowerCase() === "pending" ||
            (b.paymentStatus || "").toLowerCase() === "unpaid")
        );
      if (activeTab === "active")
        return (
          matchesSearch &&
          ((b.status || "").toLowerCase() === "confirmed" ||
            (b.status || "").toLowerCase() === "booked") &&
          isActive
        );
      if (activeTab === "completed")
        return (
          matchesSearch &&
          (isCompleted || (b.status || "").toLowerCase() === "completed")
        );
      if (activeTab === "disputes") return false; // Handled separately in disputes view
      if (activeTab === "cancelled")
        return matchesSearch && (b.status || "").toLowerCase() === "cancelled";

      return matchesSearch;
    });
  }, [bookings, search, activeTab]);

  const tabs = [
    {
      id: "all",
      label: "All Bookings",
      icon: Luggage,
      count: bookings?.length || 0,
    },
    {
      id: "pending",
      label: "Payment Pending",
      icon: Clock,
      count: pendingBookings.length,
      hasAlert: pendingBookings.length > 0,
    },
    {
      id: "active",
      label: "Upcoming & Active",
      icon: Calendar,
      count: activeBookings.length,
    },
    {
      id: "completed",
      label: "Past Stays",
      icon: CheckCircle2,
      count: pastBookings.length,
    },
    {
      id: "disputes",
      label: "Claims & Issues",
      icon: AlertCircle,
      count: customerDisputes.length,
    },
  ];

  const tabMeta = {
    all: {
      title: "All Bookings",
      subtitle: "Complete overview of all your weekend getaways and reservations",
    },
    pending: {
      title: "Payment Pending",
      subtitle: "Reservations awaiting payment confirmation to secure your stay dates",
    },
    active: {
      title: "Upcoming & Active Stays",
      subtitle: "Your upcoming weekend trips, check-in instructions, and directions",
    },
    completed: {
      title: "Past Stays",
      subtitle: "Completed getaways, stay invoices, and reviews",
    },
    disputes: {
      title: "Claims & Support Issues",
      subtitle: "Track open claims, resolution progress, and refund status",
    },
  };

  return (
    <main className="min-h-screen bg-neutral-50/60 pb-24 pt-0 md:pt-24">
      {/* Mobile Sticky Header */}
      <section className="w-full sticky top-0 bg-white/95 backdrop-blur-md px-4 py-3 z-40 border-b border-neutral-150 md:hidden flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <UserSidebar />
          <div className="flex items-center gap-1.5">
            <Luggage className="w-4 h-4 text-[#ff6900]" />
            <span className="text-sm font-bold text-neutral-900">My Bookings</span>
          </div>
        </div>
        <NotificationSheet />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {/* Desktop Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-neutral-400 mb-5">
          <Link href="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-neutral-800 font-semibold">My Bookings</span>
        </div>

        {/* Mobile Horizontal Navigation Strip (visible only on small screens) */}
        <div className="md:hidden bg-white rounded-2xl p-2.5 border border-neutral-200/80 shadow-2xs mb-5 overflow-x-auto flex items-center gap-1.5 scrollbar-none no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1.5",
                  isActive
                    ? "bg-[#ff6900] text-white shadow-xs font-bold"
                    : tab.hasAlert
                      ? "bg-amber-50 text-amber-900 border border-amber-300 font-bold"
                      : "bg-neutral-100 text-neutral-700"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                    isActive ? "bg-white/25 text-white" : "bg-white text-neutral-600"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* MAIN 2-COLUMN LAYOUT (Matching /category Layout: Left Sidebar + Right Cards) */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row items-start gap-6 lg:gap-8">
          {/* 1. Desktop Left Sidebar (Sticky to Top Header like /category) */}
          <aside className="hidden md:block w-72 lg:w-80 shrink-0 sticky top-24 self-start">
            <div className="space-y-4">
              {/* Sidebar Navigation Card */}
              <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs p-4 lg:p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-150">
                  <div className="flex items-center gap-2">
                    <Luggage className="w-4 h-4 text-[#ff6900]" />
                    <span className="font-bold text-sm text-neutral-900">
                      My Bookings
                    </span>
                  </div>
                  <span className="text-xs font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full">
                    {bookings?.length || 0} Total
                  </span>
                </div>

                {/* Tab Items List */}
                <nav className="space-y-1.5" aria-label="Bookings Navigation">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer group text-left",
                          isActive
                            ? "bg-gradient-to-r from-[#ff6900] to-[#ea580c] text-white shadow-xs"
                            : tab.hasAlert
                              ? "bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100/70"
                              : "text-neutral-700 hover:bg-neutral-100/80"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={cn(
                              "w-4 h-4 shrink-0 transition-transform group-hover:scale-110",
                              isActive
                                ? "text-white"
                                : tab.hasAlert
                                  ? "text-amber-600 animate-pulse"
                                  : "text-neutral-500"
                            )}
                          />
                          <span className="truncate">{tab.label}</span>
                        </div>
                        <span
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0",
                            isActive
                              ? "bg-white/25 text-white"
                              : tab.hasAlert
                                ? "bg-amber-200 text-amber-900"
                                : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200/70"
                          )}
                        >
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* 24/7 Concierge / Need Assistance Card */}
              <div className="bg-neutral-950 text-white rounded-3xl p-4 sm:p-5 border border-neutral-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <div className="w-7 h-7 rounded-xl bg-amber-400/15 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Need Assistance?
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Have a question about your check-in, key handover, or payment? Our concierge team is available 24/7.
                </p>
                <Button
                  asChild
                  size="sm"
                  className="w-full bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs font-bold rounded-xl h-9 gap-1.5 shadow-xs cursor-pointer"
                >
                  <Link
                    href="https://wa.me/918669186483?text=Hello%20The%20Villa%20Camp%20Support,%20I%20need%20help%20with%20my%20reservation"
                    target="_blank"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                  </Link>
                </Button>
              </div>
            </div>
          </aside>

          {/* 2. Right Main Column (Booking Cards and Controls - Normal Flow, NOT Sticky) */}
          <div className="flex-1 w-full min-w-0">
            {/* Top Controls Header (Non-sticky so it never covers cards on scroll) */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-neutral-200/90 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-extrabold text-neutral-950 tracking-tight">
                    {tabMeta[activeTab]?.title || "My Bookings"}
                  </h1>
                  <span className="text-xs font-bold text-neutral-700 bg-neutral-100 border border-neutral-200/80 px-2.5 py-0.5 rounded-full">
                    {activeTab === "disputes"
                      ? customerDisputes.length
                      : filteredBookings.length}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  {tabMeta[activeTab]?.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {/* Search Bar */}
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search property or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8.5 pr-8 py-2 text-xs rounded-full border border-neutral-200 bg-neutral-50/70 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ff6900] transition-all"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Book Stay CTA */}
                <Link
                  href="/category/all"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-950 hover:bg-[#ff6900] text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Book Stay</span>
                </Link>
              </div>
            </div>

            {/* Content Area */}
            {activeTab === "disputes" ? (
              /* Disputes / Claims Grid */
              <div>
                {disputesLoading ? (
                  <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
                    <ButtonLoader />
                    <p className="text-xs text-neutral-400">Loading claims records...</p>
                  </div>
                ) : customerDisputes.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5">
                    {customerDisputes.map((dispute) => {
                      const statusColorMap = {
                        OPEN: "bg-amber-50 text-amber-800 border-amber-200",
                        UNDER_INVESTIGATION: "bg-blue-50 text-blue-800 border-blue-200",
                        AWAITING_EVIDENCE: "bg-orange-50 text-orange-800 border-orange-200",
                        RESOLVED_REFUND_CUSTOMER: "bg-emerald-50 text-emerald-800 border-emerald-200",
                        RESOLVED_PAYOUT_OWNER: "bg-purple-50 text-purple-800 border-purple-200",
                        RESOLVED_SPLIT: "bg-indigo-50 text-indigo-800 border-indigo-200",
                        DISMISSED: "bg-neutral-100 text-neutral-800 border-neutral-200",
                      };
                      return (
                        <Card
                          key={dispute._id}
                          className="border border-neutral-200/90 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xs bg-white space-y-3"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs font-bold text-neutral-500">
                                  #{dispute.disputeId || dispute._id?.slice(-8)}
                                </span>
                                <Badge
                                  className={cn(
                                    "text-[10px] font-bold border",
                                    statusColorMap[dispute.status] || "bg-neutral-100 text-neutral-700"
                                  )}
                                >
                                  {dispute.status}
                                </Badge>
                              </div>
                              <h4 className="font-bold text-base text-neutral-900">
                                {dispute.propertyId?.name || dispute.propertyName || "Stay Claim"}
                              </h4>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-neutral-400 block">Claimed</span>
                              <span className="font-extrabold text-rose-600 text-base">
                                ₹{(dispute.disputedAmount || 0).toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded-xl border border-neutral-150">
                            {dispute.description || "Issue filed regarding cleanliness, amenities or check-in."}
                          </p>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-16 text-center border border-dashed border-neutral-200 rounded-3xl p-8 bg-white max-w-md mx-auto space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                    <h4 className="font-bold text-neutral-900 text-base">No Active Claims or Concerns</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      All your reservations completed smoothly. If you ever experience any issues, you can report it directly from the booking card.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Booking Cards List (Matching /category layout: stacked horizontal cards) */
              <div>
                {loading ? (
                  <div className="py-24 text-center flex flex-col items-center justify-center space-y-3">
                    <ButtonLoader />
                    <p className="text-xs text-neutral-400">Loading your reservations...</p>
                  </div>
                ) : filteredBookings.length > 0 ? (
                  <div className="flex flex-col gap-5 sm:gap-6">
                    {filteredBookings.map((booking) => (
                      <BookingCard
                        key={booking._id}
                        booking={booking}
                        onWriteReview={handleWriteReview}
                        onRaiseDispute={handleRaiseDispute}
                        onPaymentSuccess={() =>
                          customerId && dispatch(fetchMyBookings(customerId))
                        }
                      />
                    ))}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="bg-white rounded-3xl p-8 sm:p-14 border border-neutral-200/90 text-center max-w-lg mx-auto shadow-2xs space-y-4 my-8">
                    <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6900] mx-auto shadow-xs">
                      <Calendar className="w-7 h-7 text-[#ff6900]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg sm:text-xl font-extrabold text-neutral-900">
                        {activeTab === "pending"
                          ? "No Pending Reservations"
                          : search
                            ? "No Stays Match Search"
                            : "No Bookings Found"}
                      </h3>
                      <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                        {activeTab === "pending"
                          ? "You have no incomplete payments. All your reservations are confirmed and ready for your arrival!"
                          : search
                            ? `No bookings found for "${search}". Try searching with a different property name or reference code.`
                            : "You haven't made any reservations in this section yet. Find your next luxury villa or camping retreat today."}
                      </p>
                    </div>
                    <div className="pt-2">
                      <Button
                        onClick={() => (window.location.href = "/category/all")}
                        className="bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-md transition-all cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5 mr-1.5" /> Explore Stays
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ReviewDrawer
        isOpen={reviewDrawerOpen}
        onClose={() => setReviewDrawerOpen(false)}
        booking={selectedBookingForReview}
      />
      <DisputeDrawer
        isOpen={disputeDrawerOpen}
        onClose={() => setDisputeDrawerOpen(false)}
        booking={selectedBookingForDispute}
        onSuccess={() => customerId && loadCustomerDisputes(customerId)}
      />
    </main>
  );
}
