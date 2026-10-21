"use client";

import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Users,
  Phone,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  CreditCard,
  Headphones,
  HelpCircle,
  AlertTriangle,
  ShieldAlert,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { addToast } from "@heroui/react";
import { RequestCancellationAPI } from "@/lib/API/Booking/Booking";

function WhatsAppIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.07l-.29-.16-3.02.79.81-2.94-.19-.3a8.204 8.204 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.35-.77-1.85c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.02 2.6c.12.17 1.77 2.7 4.29 3.78.6.26 1.07.41 1.44.53.6.19 1.15.16 1.59.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31z" />
    </svg>
  );
}

export function ReservationPassModal({
  isOpen,
  onClose,
  booking,
  onPayNow,
  onRefresh,
}) {
  const isMobile = useIsMobile();
  const [copiedId, setCopiedId] = useState(false);

  if (!booking) return null;

  const prop = booking.propertyId || booking.property;
  const propName =
    prop?.name ||
    prop?.campName ||
    prop?.cottageTitle ||
    prop?.hotelName ||
    booking.items?.[0]?.typeName ||
    (booking.propertyType ? `${booking.propertyType} Stay` : "The Villa Camp Haven");

  const images = prop?.images || [];
  const cover =
    images[0] ||
    prop?.coverImage ||
    prop?.propertyImage ||
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80";

  const city =
    prop?.city ||
    prop?.address?.city ||
    prop?.address?.street ||
    prop?.location?.name ||
    "Lonavala";

  const bookingCode =
    booking._id?.slice(-8).toUpperCase() || "DE1F59B8";

  const [localStatus, setLocalStatus] = useState(booking?.status || "confirmed");
  const [localCancellation, setLocalCancellation] = useState(booking?.cancellation || {});
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  useEffect(() => {
    if (booking) {
      setLocalStatus(booking.status || "confirmed");
      setLocalCancellation(booking.cancellation || {});
      setShowCancelForm(false);
      setCancelReason("");
    }
  }, [booking]);

  const activeStatusStr = (localStatus || booking.status || booking.bookingStatus || "confirmed").toLowerCase();
  const isCancellationRequested =
    activeStatusStr === "cancellation_requested" || Boolean(localCancellation?.requested);
  const isCancelled =
    activeStatusStr === "cancelled" || Boolean(localCancellation?.cancelled);
  const isCompleted = activeStatusStr === "completed";
  const isPending =
    !isCancelled &&
    !isCancellationRequested &&
    !isCompleted &&
    (activeStatusStr === "pending" || (booking.paymentStatus || "").toLowerCase() === "unpaid");

  const checkInDate = booking.checkIn ? new Date(booking.checkIn) : null;
  const checkOutDate = booking.checkOut ? new Date(booking.checkOut) : null;

  const daysUntilCheckIn = checkInDate && !isNaN(checkInDate)
    ? Math.ceil((checkInDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  const handleRequestCancel = async () => {
    if (!cancelReason.trim()) {
      addToast({
        title: "Reason Required",
        description: "Please specify why you need to cancel this reservation.",
        color: "warning",
      });
      return;
    }

    setIsSubmittingCancel(true);
    try {
      const res = await RequestCancellationAPI(booking._id, cancelReason.trim());
      if (res?.success) {
        addToast({
          title: "Cancellation Request Submitted 📋",
          description: "An administrator will review your request. You will be notified once reviewed.",
          color: "success",
        });
        setLocalStatus("cancellation_requested");
        setLocalCancellation({
          requested: true,
          cancelled: false,
          reason: cancelReason.trim(),
          requestedAt: new Date(),
        });
        setShowCancelForm(false);
        if (onRefresh) onRefresh();
      } else {
        addToast({
          title: "Submission Failed",
          description: res?.message || "Failed to submit cancellation request",
          color: "danger",
        });
      }
    } catch (err) {
      addToast({
        title: "Error",
        description: err?.message || "An unexpected error occurred",
        color: "danger",
      });
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  const checkInFmt = checkInDate
    ? checkInDate.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    : "Fri, 23 Oct, 2026";

  const checkOutFmt = checkOutDate
    ? checkOutDate.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    : "Sat, 24 Oct, 2026";

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

  const pricing = booking.pricing || {
    subtotal: booking.totalPrice || 1600,
    eventExtraCharge: 0,
    mealExtraCharge: 0,
    discountAmount: 0,
    taxAmount: Math.round((booking.totalPrice || 1600) * 0.18),
    totalAmount: booking.totalPrice ? Math.round(booking.totalPrice * 1.18) : 1888,
    currency: "INR",
  };

  const guestName =
    booking.customerDetails?.name ||
    (booking.customerDetails?.firstName
      ? `${booking.customerDetails.firstName} ${booking.customerDetails.lastName || ""}`.trim()
      : "") ||
    booking.userName ||
    booking.guestName ||
    booking.userId?.name ||
    booking.userId?.fullName ||
    "San Santosh Alimkar";

  const guestPhone =
    booking.customerDetails?.mobile ||
    booking.customerDetails?.phone ||
    booking.userPhone ||
    booking.phone ||
    booking.userId?.mobile ||
    "8669186483";

  const guestEmail =
    booking.customerDetails?.email ||
    booking.userEmail ||
    booking.email ||
    booking.userId?.email ||
    "santosh.sa4d@gmail.com";

  const guestCity =
    booking.customerDetails?.city ||
    booking.userCity ||
    booking.city ||
    booking.userId?.city ||
    "Pune";

  // Payments & Balance Calculation
  const successfulPayments = (booking.payments || []).filter(
    (p) => p.status === "successful"
  );

  const paidAmount =
    booking.totalPaid !== undefined
      ? booking.totalPaid
      : successfulPayments.length > 0
        ? successfulPayments.reduce((s, p) => s + (p.amount || 0), 0)
        : !isPending && !isCancelled
          ? pricing.totalAmount || 1888
          : 0;

  const balanceDue =
    booking.pendingAmount !== undefined
      ? booking.pendingAmount
      : Math.max(0, (pricing.totalAmount || 0) - paidAmount);

  const latestPayment = successfulPayments[successfulPayments.length - 1];
  const paymentMethodName = latestPayment?.paymentMethod
    ? latestPayment.paymentMethod.toUpperCase()
    : paidAmount > 0
      ? "ONLINE (UPI / RAZORPAY)"
      : "PAYMENT PENDING";

  const transactionRef = latestPayment?.transactionId
    ? `#${latestPayment.transactionId.slice(-10).toUpperCase()}`
    : booking.paymentId || booking.razorpayPaymentId || "#T9IQJYWB1";

  const hostPhone =
    prop?.contactNumber ||
    prop?.phone ||
    prop?.mobileNumber ||
    prop?.hostPhone ||
    booking.hostPhone ||
    "8669186483";

  const hostPhoneClean = hostPhone.replace(/\D/g, "").slice(-10) || "8669186483";

  const handleCopyId = (e) => {
    e?.stopPropagation();
    if (typeof window !== "undefined" && booking._id) {
      navigator.clipboard.writeText(booking._id);
      setCopiedId(true);
      addToast({
        title: "Booking ID Copied",
        description: `Booking #${bookingCode} copied to clipboard`,
        color: "success",
      });
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Reserved Accommodations list
  const accommodations =
    Array.isArray(booking.items) && booking.items.length > 0
      ? booking.items
      : [
        {
          quantity: 2,
          typeName: "Single",
          pricePerNight: 800,
          totalPrice: 1600,
        },
      ];

  // Inner Content Layout (Exact 1:1 replication of Thevillacamp app)
  const modalContent = (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Top Grabber Handle (For mobile bottom sheet feel) */}
      <div className="pt-2.5 pb-1 flex justify-center sm:hidden shrink-0">
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full" />
      </div>

      {/* Modal Header */}
      <div className="flex items-start justify-between gap-3 px-4 sm:px-6 pt-2 sm:pt-4 pb-3 bg-white border-b border-neutral-100 shrink-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
              Reservation Details
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                isCancelled
                  ? "bg-rose-600 text-white"
                  : isCancellationRequested
                    ? "bg-amber-500 text-white animate-pulse"
                    : isPending
                      ? "bg-amber-500 text-white"
                      : isCompleted
                        ? "bg-neutral-800 text-white"
                        : "bg-[#00875A] text-white"
              }`}
            >
              {isCancelled
                ? "CANCELLED"
                : isCancellationRequested
                  ? "CANCEL REQUESTED"
                  : isPending
                    ? "PENDING"
                    : isCompleted
                      ? "COMPLETED"
                      : "CONFIRMED"}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-neutral-400 font-mono font-medium">
              Booking Ref: #{bookingCode}
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              className="text-neutral-400 hover:text-neutral-700 cursor-pointer p-0.5"
              title="Copy Booking ID"
            >
              {copiedId ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Body with Cards */}
      <div
        data-vaul-no-drag
        className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-5 pb-8 sm:pb-6 space-y-3.5 no-scrollbar overscroll-contain"
      >
        {/* 🚨 CANCELLATION REQUESTED BANNER */}
        {isCancellationRequested && (
          <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-xs font-black uppercase tracking-wider">
                Cancellation Request Under Review
              </span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Your cancellation request has been submitted and is currently being evaluated by our administrative desk in accordance with the cancellation policy. In order to protect your stay and prevent automated errors, your reserved dates are retained until admin review is complete.
            </p>
            {localCancellation?.reason && (
              <div className="text-[11px] text-amber-800/90 pt-1.5 border-t border-amber-200/70">
                <span className="font-bold">Reason Provided:</span> "{localCancellation.reason}"
              </div>
            )}
          </div>
        )}

        {/* 📋 CANCELLED SUMMARY CARD */}
        {isCancelled && (
          <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-800">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="text-xs font-black uppercase tracking-wider">Stay Cancelled</span>
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  localCancellation?.refundStatus === "processed"
                    ? "bg-emerald-100 text-emerald-800"
                    : localCancellation?.refundStatus === "pending"
                      ? "bg-blue-100 text-blue-800"
                      : localCancellation?.refundStatus === "rejected"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-neutral-200 text-neutral-800"
                }`}
              >
                {localCancellation?.refundStatus
                  ? localCancellation.refundStatus.replace("_", " ")
                  : "Non-refundable"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-700 pt-1">
              <div>
                <span className="text-neutral-400 block text-[10px] font-bold uppercase">Refund Amount</span>
                <span className="font-extrabold text-neutral-900">
                  ₹{(localCancellation?.refundAmount || 0).toLocaleString("en-IN")}
                </span>
              </div>
              {localCancellation?.refundTransactionId && (
                <div>
                  <span className="text-neutral-400 block text-[10px] font-bold uppercase">Refund Reference</span>
                  <span className="font-mono text-neutral-900 truncate block text-[11px]">
                    {localCancellation.refundTransactionId}
                  </span>
                </div>
              )}
            </div>
            {localCancellation?.adminNotes && (
              <p className="text-[11px] text-neutral-500 pt-1 border-t border-rose-100">
                Admin Note: {localCancellation.adminNotes}
              </p>
            )}
          </div>
        )}
        {/* 1. Property Card */}
        <div className="bg-white rounded-2xl p-3 border border-neutral-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-neutral-100">
            <img
              src={cover}
              alt={propName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-black tracking-wider text-[#EA580C] uppercase truncate">
              {(booking.propertyType || "CAMPING").toUpperCase()} • {city.toUpperCase()}
            </div>
            <h3 className="text-sm sm:text-base font-black text-neutral-900 truncate mt-0.5">
              {propName}
            </h3>
            <p className="text-xs text-neutral-500 truncate mt-0.5">
              {booking.items?.[0]?.typeName ||
                (booking.propertyType
                  ? `Exclusive ${booking.propertyType} Stay`
                  : "Single")}
            </p>
          </div>
        </div>

        {/* 2. Check-In & Check-Out Grid */}
        <div className="bg-white rounded-2xl p-3.5 border border-neutral-200/80 shadow-2xs space-y-3">
          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
                CHECK-IN
              </span>
              <div className="text-xs sm:text-sm font-black text-neutral-900 mt-0.5">
                {checkInFmt}
              </div>
              <span className="text-[11px] text-neutral-500 block mt-0.5">
                From 2:00 PM
              </span>
            </div>

            <div className="border-l border-neutral-200 pl-3.5">
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
                CHECK-OUT
              </span>
              <div className="text-xs sm:text-sm font-black text-neutral-900 mt-0.5">
                {checkOutFmt}
              </div>
              <span className="text-[11px] text-neutral-500 block mt-0.5">
                Until 11:00 AM
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2.5 border-t border-neutral-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
              <Calendar className="w-4 h-4 text-[#EA580C]" />
              <span>
                {nightsCount} Night{nightsCount > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
              <Users className="w-4 h-4 text-[#EA580C]" />
              <span>
                {booking.guests?.adults || 3} Adults
                {booking.guests?.children ? `, ${booking.guests.children} Children` : ", 1 Children"}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Primary Guest Information */}
        <div className="bg-white rounded-2xl p-3.5 border border-neutral-200/80 shadow-2xs space-y-2">
          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
            PRIMARY GUEST DETAILS
          </span>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-50 text-[#EA580C] flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-black text-neutral-900 truncate">
                {guestName}
              </div>
              <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                +91 {guestPhone} • {guestEmail}
              </div>
              {guestCity && (
                <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                  Location: {guestCity}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. Reserved Accommodations */}
        <div className="bg-white rounded-2xl p-3.5 border border-neutral-200/80 shadow-2xs space-y-2.5">
          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
            RESERVED ACCOMMODATIONS
          </span>
          {accommodations.map((item, idx) => (
            <div key={idx} className="flex items-start justify-between gap-2 pt-1 first:pt-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#EA580C] shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                    {item.quantity || 1} × {item.typeName || item.unitType || "Single"}
                  </span>
                </div>
                {item.pricePerNight ? (
                  <div className="text-[11px] text-neutral-400 pl-4 mt-0.5">
                    ₹{Number(item.pricePerNight).toLocaleString("en-IN")} / night
                  </div>
                ) : null}
              </div>
              <span className="text-xs sm:text-sm font-black text-neutral-900 shrink-0">
                ₹{Number(item.totalPrice || item.pricePerNight * item.quantity || 1600).toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>

        {/* 5. Official Price Breakdown (INR) */}
        <div className="bg-white rounded-2xl p-3.5 border border-neutral-200/80 shadow-2xs space-y-2.5">
          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
            OFFICIAL PRICE BREAKDOWN (INR)
          </span>

          <div className="flex items-center justify-between text-xs text-neutral-600">
            <span>Base stay rate × {nightsCount} night{nightsCount > 1 ? "s" : ""}</span>
            <span className="font-bold text-neutral-900">
              ₹{(pricing.subtotal || 1600).toLocaleString("en-IN")}
            </span>
          </div>

          {Boolean(pricing.eventExtraCharge) && (
            <div className="flex items-center justify-between text-xs text-neutral-600">
              <span>Event venue & guest charge</span>
              <span className="font-bold text-neutral-900">
                ₹{pricing.eventExtraCharge.toLocaleString("en-IN")}
              </span>
            </div>
          )}

          {Boolean(pricing.mealExtraCharge) && (
            <div className="flex items-center justify-between text-xs text-neutral-600">
              <span>Meal dining package</span>
              <span className="font-bold text-neutral-900">
                ₹{pricing.mealExtraCharge.toLocaleString("en-IN")}
              </span>
            </div>
          )}

          {Boolean(pricing.discountAmount) && (
            <div className="flex items-center justify-between text-xs text-emerald-600 font-semibold">
              <span>Coupon discount ({booking.coupon?.code || "APPLIED"})</span>
              <span>-₹{pricing.discountAmount.toLocaleString("en-IN")}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-neutral-600">
            <span>GST & Hospitality Taxes (18%)</span>
            <span className="font-bold text-neutral-900">
              ₹{(pricing.taxAmount || 288).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2.5 border-t border-neutral-100 text-xs sm:text-sm">
            <span className="font-black text-neutral-900">Total Reservation Amount</span>
            <span className="font-black text-neutral-900">
              ₹{(pricing.totalAmount || 1888).toLocaleString("en-IN")}
            </span>
          </div>

          {/* Amount Paid Row */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div>
              <span className="text-neutral-600 font-medium block">
                Amount Paid ({paymentMethodName})
              </span>
              {transactionRef && (
                <span className="text-[10px] text-neutral-400 block font-mono">
                  Txn Ref: {transactionRef}
                </span>
              )}
            </div>
            <span className="font-black text-emerald-600 text-sm">
              ₹{paidAmount.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Balance Due Row (Pill format matching screenshot 3) */}
          <div
            className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold mt-1 ${balanceDue > 0
                ? "bg-amber-50 text-amber-900 border-amber-200"
                : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}
          >
            <div className="flex items-center gap-2">
              {balanceDue > 0 ? (
                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
              <span>Balance Due</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black">
                ₹{balanceDue.toLocaleString("en-IN")}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${balanceDue > 0
                    ? "bg-amber-200 text-amber-900"
                    : "bg-emerald-100 text-emerald-800"
                  }`}
              >
                {balanceDue > 0 ? "Pending" : "Fully Cleared"}
              </span>
            </div>
          </div>

          {/* Pay Balance Button if Pending */}
          {isPending && balanceDue > 0 && onPayNow && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onPayNow(booking);
              }}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#ff6900] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c84d00] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Balance Now • ₹{balanceDue.toLocaleString("en-IN")}</span>
            </button>
          )}
        </div>

        {/* 6. Host & Stay Assistance Support (Exact match to screenshot 3) */}
        <div className="bg-white rounded-2xl p-3.5 border border-neutral-200/80 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#ff6900] flex items-center justify-center shrink-0">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-black text-neutral-900 truncate">
                  Host & Stay Assistance
                </div>
                <div className="text-[11px] text-neutral-500 truncate">
                  Direct on-ground care for your getaway
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active Desk</span>
            </div>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed">
            Need directions to {propName}, early check-in coordination, meal planning, or key handover? Connect directly with the villa host or our 24/7 guest concierge desk.
          </p>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <a
              href={`tel:${hostPhoneClean}`}
              className="py-2.5 px-2 rounded-xl bg-[#ff6900] hover:bg-[#ea580c] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Host</span>
            </a>

            <a
              href={`https://wa.me/91${hostPhoneClean}?text=${encodeURIComponent(
                `Hello! I have a confirmed reservation #${bookingCode} for ${propName}. I need assistance regarding my stay.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href="tel:8669186483"
              className="py-2.5 px-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />
              <span>24/7 Help</span>
            </a>
          </div>
        </div>

        {/* 7. Cancellation Request Section */}
        {!isCancelled && !isCancellationRequested && !isCompleted && (
          <div className="bg-white rounded-2xl p-3.5 border border-neutral-200/80 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-neutral-500" />
                <span className="text-xs font-black text-neutral-900 uppercase tracking-wider">
                  Cancellation Policy & Options
                </span>
              </div>
              <span className="text-[11px] font-bold text-neutral-500">
                {daysUntilCheckIn > 0 ? `${daysUntilCheckIn} day(s) to check-in` : "Check-in today"}
              </span>
            </div>

            {!showCancelForm ? (
              <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Need to cancel your stay? Cancellation requests are reviewed by an administrator prior to refund execution.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCancelForm(true)}
                  className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border border-neutral-200 text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  Request Cancellation
                </button>
              </div>
            ) : (
              <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200 space-y-3 pt-2">
                <div className="text-xs space-y-1">
                  <p className="font-bold text-neutral-800">
                    Estimated Policy Tier:{" "}
                    <span className="text-[#ff6900]">
                      {daysUntilCheckIn > 7
                        ? "Flexible Tier (~90% refund upon admin approval)"
                        : daysUntilCheckIn > 3
                        ? "Moderate Tier (~50% refund upon admin approval)"
                        : "Strict Tier (Non-refundable proximity)"}
                    </span>
                  </p>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    To prevent automated errors and safeguard your booking, our admin team reviews each request before authorizing eligible refunds.
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                    Reason for Cancellation <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Please explain why you need to cancel this booking..."
                    className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#ff6900]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isSubmittingCancel}
                    onClick={handleRequestCancel}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingCancel ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    )}
                    <span>Submit Cancellation Request</span>
                  </button>
                  <button
                    type="button"
                    disabled={isSubmittingCancel}
                    onClick={() => setShowCancelForm(false)}
                    className="px-3 py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Keep Reservation
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Safe bottom spacer to ensure complete visibility above the footer */}
        <div className="h-12 sm:h-6 w-full shrink-0" aria-hidden="true" />
      </div>

      {/* Bottom Action Footer */}
      <div className="bg-white/95 backdrop-blur-md p-3 sm:p-4 pb-6 sm:pb-4 border-t border-neutral-200/80 flex items-center gap-2 z-20 shrink-0">
        {isPending ? (
          <button
            type="button"
            onClick={() => {
              onClose();
              onPayNow && onPayNow(booking);
            }}
            className="flex-1 h-11 sm:h-12 rounded-xl bg-[#ff6900] hover:bg-[#ea580c] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-98"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay Now • ₹{balanceDue.toLocaleString("en-IN")}</span>
          </button>
        ) : (
          <>
            <a
              href={`tel:${hostPhoneClean}`}
              className="flex-1 h-11 sm:h-12 rounded-xl bg-[#ff6900] hover:bg-[#ea580c] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call Villa Host</span>
            </a>

            <a
              href={`https://wa.me/91${hostPhoneClean}?text=${encodeURIComponent(
                `Hello! I have a confirmed reservation #${bookingCode} for ${propName}. I need assistance regarding my stay.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 sm:w-12 h-11 sm:h-12 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 transition-colors shadow-2xs cursor-pointer"
              aria-label="Chat with host on WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5" />
            </a>
          </>
        )}

        <button
          type="button"
          onClick={onClose}
          className="h-11 sm:h-12 px-4 sm:px-5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs shrink-0 transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );

  // Mobile Bottom Drawer
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="h-[92vh] max-h-[92vh] data-[vaul-drawer-direction=bottom]:max-h-[92vh] bg-[#F8FAFC] rounded-t-3xl border-t border-neutral-200 flex flex-col p-0 overflow-hidden outline-none z-[9999]">
          <DrawerTitle className="sr-only">Reservation Details</DrawerTitle>
          {modalContent}
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop Centered Modal
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] h-[85vh] bg-[#F8FAFC] rounded-3xl border border-neutral-200 p-0 overflow-hidden shadow-2xl z-[9999] outline-none flex flex-col">
        <DialogTitle className="sr-only">Reservation Details</DialogTitle>
        {modalContent}
      </DialogContent>
    </Dialog>
  );
}
