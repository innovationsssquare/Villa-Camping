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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, Tab } from "@heroui/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { UserSidebar } from "@/components/Navbarcomponents/Sidebar";
import { NotificationSheet } from "@/components/Navbarcomponents/Notificationsheet";
import { EmptyState } from "./empty-states";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBookings } from "@/Redux/Slices/myBookingSlice";
import { ReviewDrawer } from "./Review-drawer";
import { DisputeDrawer } from "./Dispute-drawer";
import { GetCustomerDisputesAPI } from "@/lib/API/Dispute/Dispute";
import ButtonLoader from "@/components/Loadercomponents/button-loader";
import { addToast } from "@heroui/react";

const StatusBadge = ({ status }) => {
  const s = (status || "confirmed").toLowerCase();
  if (s === "booked" || s === "confirmed") {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        Confirmed
      </Badge>
    );
  }
  if (s === "completed") {
    return (
      <Badge className="bg-neutral-100 text-neutral-700 border border-neutral-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3 text-neutral-500" />
        Completed
      </Badge>
    );
  }
  if (s === "cancelled") {
    return (
      <Badge className="bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
        <XCircle className="w-3 h-3 text-rose-600" />
        Cancelled
      </Badge>
    );
  }
  if (s === "pending") {
    return (
      <Badge className="bg-amber-50 text-amber-800 border border-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
        <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
        Payment Pending
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
      <Clock className="w-3 h-3 text-amber-600" />
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
    guests,
    items,
    holdExpiresAt,
    paymentLink,
  } = booking;

  const isPending =
    (status || "").toLowerCase() === "pending" ||
    (paymentStatus || "").toLowerCase() === "unpaid";

  // Countdown timer for pending reservations
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
  const locationText =
    propertyId?.location ||
    propertyId?.address ||
    propertyId?.city ||
    "Maharashtra, India";
  const images = propertyId?.images || [];
  const coverImage =
    images[0] ||
    propertyId?.coverImage ||
    propertyId?.images?.[0] ||
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&auto=format&fit=crop&q=80";

  const formattedCheckIn = checkIn
    ? new Date(checkIn).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const formattedCheckOut = checkOut
    ? new Date(checkOut).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
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

  const handleCopyId = () => {
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
          variant: "destructive",
        });
        setRetrying(false);
        return;
      }

      if (data.alreadyConfirmed) {
        addToast({
          title: "Booking Already Confirmed",
          description: "This reservation is already paid and confirmed!",
          variant: "success",
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
                  variant: "success",
                  duration: 5000,
                });
                onPaymentSuccess && onPaymentSuccess();
              } else {
                addToast({
                  title: "Verification Failed",
                  description:
                    "Payment was captured, but verification is pending. Please contact support.",
                  variant: "destructive",
                });
              }
            } catch (err) {
              console.error("Verification error:", err);
            } finally {
              setRetrying(false);
            }
          },
          prefill: {
            name: `${booking.customerDetails?.firstName || ""} ${
              booking.customerDetails?.lastName || ""
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
        variant: "destructive",
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
  const isConfirmed =
    (status || "").toLowerCase() === "confirmed" ||
    (status || "").toLowerCase() === "booked";

  return (
    <Card className="overflow-hidden rounded-2xl border border-neutral-200/90 shadow-2xs hover:shadow-md transition-all bg-white">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Left Column: Image & Overlay Badges */}
          <div className="relative md:w-72 lg:w-80 shrink-0 h-48 md:h-auto min-h-[190px] overflow-hidden bg-neutral-900">
            <img
              src={coverImage}
              alt={propertyName}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 md:hidden" />
            
            {/* Top Status & Night Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <StatusBadge status={status} />
            </div>

            <div className="absolute bottom-3 left-3 md:bottom-auto md:top-3 md:right-3 md:left-auto">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/70 backdrop-blur-md text-white border border-white/20">
                {nights} {nights === 1 ? "Night" : "Nights"}
              </span>
            </div>
          </div>

          {/* Right Column: Reservation Details */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-4">
            {/* Pending Reservation Hold Alert Banner */}
            {isPending && (
              <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200/90 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900 shadow-2xs">
                <div className="flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    {isExpired
                      ? "Hold expired — Dates may be released to other guests"
                      : "Reservation held temporarily — Complete payment to lock in your dates"}
                  </span>
                </div>
                {timeLeft && !isExpired && (
                  <span className="font-bold text-amber-800 font-mono bg-amber-100/90 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px] shrink-0">
                    ⏱️ {timeLeft}
                  </span>
                )}
              </div>
            )}

            {/* Top Row: Booking ID + Title + Status (Desktop) */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopyId}
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/70 px-2 py-0.5 rounded transition-colors cursor-pointer"
                    title="Click to copy full ID"
                  >
                    <span>#{bookingCode}</span>
                    {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-[#ff6900] border border-orange-200">
                    {booking?.propertyType || "Stay"}
                  </span>
                </div>
                <span className="text-[11px] text-neutral-400 font-medium hidden sm:inline">
                  {isPending ? "Payment Pending" : "Reservation Confirmed"}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-extrabold text-neutral-900 tracking-tight leading-snug">
                {propertyName}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                <span className="truncate">{locationText}</span>
              </div>
            </div>

            {/* Middle Row: Check-in / Check-out Timeline */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-150">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Check-in
                </span>
                <span className="text-xs font-bold text-neutral-800 mt-0.5 block">
                  {formattedCheckIn}
                </span>
                <span className="text-[10px] text-neutral-400">After 2:00 PM</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Check-out
                </span>
                <span className="text-xs font-bold text-neutral-800 mt-0.5 block">
                  {formattedCheckOut}
                </span>
                <span className="text-[10px] text-neutral-400">By 11:00 AM</span>
              </div>
            </div>

            {/* Bottom Row: Price Summary & Action Buttons */}
            <div className="pt-2 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Total Paid / Amount Due */}
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-neutral-400 font-medium">
                    {isPending ? "Amount Due:" : "Total Paid:"}
                  </span>
                  <span
                    className={cn(
                      "text-base font-extrabold",
                      isPending ? "text-amber-700" : "text-neutral-950"
                    )}
                  >
                    ₹{pricingDetails.totalAmount?.toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                  className="text-[11px] text-[#ff6900] hover:underline font-semibold flex items-center gap-0.5 cursor-pointer mt-0.5"
                >
                  {showPriceBreakdown ? "Hide breakdown" : "View price breakdown"}
                  {showPriceBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* Action Buttons */}
              {isPending ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleRetryPayment}
                    disabled={retrying}
                    className="rounded-xl text-xs font-bold bg-[#ff6900] hover:bg-[#e05d00] text-white gap-1.5 h-8 shadow-xs cursor-pointer flex-1 sm:flex-none justify-center px-4"
                  >
                    {retrying ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Complete Payment</span>
                      </>
                    )}
                  </Button>

                  {paymentLink?.shortUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyPaymentLink}
                      className="rounded-xl text-xs font-semibold text-neutral-700 border-neutral-200 hover:bg-neutral-100 gap-1.5 h-8 cursor-pointer flex-1 sm:flex-none justify-center"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Link Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#ff6900]" />
                          <span>Copy Pay Link</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenMaps}
                    className="rounded-xl text-xs font-semibold text-neutral-700 border-neutral-200 hover:bg-neutral-100 gap-1.5 h-8 cursor-pointer flex-1 sm:flex-none justify-center"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#ff6900]" />
                    Directions
                  </Button>

                  {isCompleted && (
                    <Button
                      size="sm"
                      onClick={() => onWriteReview && onWriteReview(booking)}
                      className="rounded-xl text-xs font-semibold bg-[#ff6900] hover:bg-[#e05d00] text-white gap-1 h-8 shadow-xs cursor-pointer flex-1 sm:flex-none justify-center"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Write Review
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRaiseDispute && onRaiseDispute(booking)}
                    className="rounded-xl text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50 gap-1 h-8 cursor-pointer flex-1 sm:flex-none justify-center"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Report Issue
                  </Button>
                </div>
              )}
            </div>

            {/* Collapsible Price Breakdown */}
            {showPriceBreakdown && (
              <div className="p-3.5 rounded-xl bg-orange-50/50 border border-orange-200/60 space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Base Stay ({nights} nights)</span>
                  <span className="font-semibold text-neutral-800">
                    ₹{pricingDetails.subtotal?.toLocaleString("en-IN")}
                  </span>
                </div>
                {pricingDetails.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon / Promo Discount</span>
                    <span>-₹{pricingDetails.discountAmount?.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Taxes & Concierge Fees</span>
                  <span className="font-semibold text-neutral-800">
                    ₹{pricingDetails.taxAmount?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="pt-1.5 border-t border-orange-200 flex justify-between font-bold text-neutral-950">
                  <span>Total Amount Paid</span>
                  <span>₹{pricingDetails.totalAmount?.toLocaleString("en-IN")}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
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
      } catch {}
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

  const filteredBookings = useMemo(() => {
    const q = search.toLowerCase().trim();
    return (bookings || []).filter((b) => {
      const prop = b.propertyId;
      const matchesSearch =
        !q ||
        b._id?.toLowerCase().includes(q) ||
        b.status?.toLowerCase().includes(q) ||
        prop?.name?.toLowerCase().includes(q) ||
        prop?.location?.toLowerCase().includes(q) ||
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
          ((b.status || "").toLowerCase() === "confirmed" ||
            (b.status || "").toLowerCase() === "booked") &&
          isCompleted
        );
      if (activeTab === "cancelled")
        return matchesSearch && (b.status || "").toLowerCase() === "cancelled";

      return matchesSearch;
    });
  }, [bookings, search, activeTab]);

  return (
    <main className="min-h-screen bg-neutral-50/60 pb-24 pt-0 md:pt-28">
      {/* Mobile Sticky Header - Flush at top-0 with 0px top margin */}
      <section className="w-full sticky top-0 bg-white/95 backdrop-blur-md px-4 py-3 z-40 border-b border-neutral-150 md:hidden flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <UserSidebar />
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#ff6900]" />
            <span className="text-sm font-bold text-neutral-900">My Bookings</span>
          </div>
        </div>
        <NotificationSheet />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {/* Desktop Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-neutral-400 mb-4">
          <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-neutral-800 font-semibold">My Bookings</span>
        </div>

        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
              My Bookings & Reservations
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Manage your upcoming weekend escapes, access past stay invoices, and request assistance
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/category/all"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-950 hover:bg-[#ff6900] text-white text-xs font-semibold shadow-xs transition-all"
            >
              <Compass className="w-3.5 h-3.5" /> Book New Stay
            </Link>
          </div>
        </div>

        {/* Tabs & Search Bar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-neutral-200/80 shadow-2xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Filter Tabs - Wrapped to eliminate any horizontal scrollbar on mobile */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full md:w-auto">
            {[
              { id: "all", label: `All Stays (${bookings?.length || 0})` },
              {
                id: "pending",
                label: `Incomplete / Pending (${pendingBookings.length})`,
                hasAlert: pendingBookings.length > 0,
              },
              { id: "active", label: "Upcoming / Active" },
              { id: "completed", label: "Past Stays" },
              { id: "disputes", label: `Claims & Issues (${customerDisputes.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-[#ff6900] text-white shadow-xs"
                    : tab.hasAlert
                    ? "bg-amber-50 text-amber-900 border border-amber-300 font-bold hover:bg-amber-100/90 animate-pulse"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200/70"
                }`}
              >
                {tab.hasAlert && <Clock className="w-3 h-3 text-amber-700" />}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by villa or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-full border border-neutral-200 bg-neutral-50/70 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ff6900] transition-all"
            />
          </div>
        </div>

        {/* Content Area */}
        {activeTab === "disputes" ? (
          /* Disputes / Claims Tab */
          <div>
            {disputesLoading ? (
              <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
                <ButtonLoader />
                <p className="text-xs text-neutral-400">Loading your claims records...</p>
              </div>
            ) : customerDisputes.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
                    <Card key={dispute._id} className="border border-neutral-200/90 p-5 rounded-2xl shadow-2xs bg-white space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-neutral-500">
                              #{dispute.disputeId || dispute._id?.slice(-8)}
                            </span>
                            <Badge className={cn("text-[10px] font-bold border", statusColorMap[dispute.status] || "bg-neutral-100 text-neutral-700")}>
                              {dispute.status}
                            </Badge>
                          </div>
                          <h4 className="font-bold text-base text-neutral-900">
                            {dispute.propertyId?.name || dispute.propertyName || "Villa Stay"}
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-neutral-400 block">Claimed</span>
                          <span className="font-bold text-rose-600 text-base">
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
              <div className="py-16 text-center border border-dashed border-neutral-200 rounded-3xl p-8 bg-white max-w-lg mx-auto space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-bold text-neutral-900 text-base">No Active Claims or Concerns</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  All your past reservations completed smoothly. If you ever experience any issues with a stay, you can report it directly from the booking card.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Bookings Tab (All, Incomplete, Active, Completed) */
          <div>
            {loading ? (
              <div className="py-24 text-center flex flex-col items-center justify-center space-y-3">
                <ButtonLoader />
                <p className="text-xs text-neutral-400">Loading your reservations...</p>
              </div>
            ) : filteredBookings.length > 0 ? (
              <div className="space-y-4">
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
              <div className="bg-white rounded-3xl p-8 sm:p-14 border border-neutral-200/90 text-center max-w-xl mx-auto shadow-2xs space-y-4 my-6">
                <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6900] mx-auto shadow-xs">
                  <Calendar className="w-8 h-8 text-[#ff6900]" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                    {activeTab === "pending"
                      ? "No Incomplete Reservations"
                      : "No Bookings Found"}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
                    {activeTab === "pending"
                      ? "You have no pending payments. All your reservations are confirmed and ready for your arrival!"
                      : search
                      ? "No reservations matched your search query. Try searching with a different property name or reference code."
                      : "You haven't made any reservations in this section yet. Find your next luxury villa or camping retreat today."}
                  </p>
                </div>
                <div className="pt-3">
                  <Button
                    onClick={() => (window.location.href = "/category/all")}
                    className="bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs font-bold px-7 py-3 rounded-full shadow-md transition-all cursor-pointer"
                  >
                    <Compass className="w-4 h-4 mr-2" /> Explore Stays
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
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
