"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Clock,
  LogIn,
  LogOut,
  Phone,
  Copy,
  CheckCheck,
  ArrowRight,
  X,
  User,
  Home,
  Building,
  Waves,
  Flame,
  Wifi,
  Wind,
  Bed,
  Tent,
  Trees,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { GetBookingById } from "@/lib/API/Booking/Booking";

export default function BookingConfirmationScreen({
  bookingId: propBookingId,
  bookingData: propBookingData,
  property: propProperty,
  pricingDetails: propPricing,
  customerDetails: propCustomer,
  checkInDate: propCheckIn,
  checkOutDate: propCheckOut,
  totalDays: propTotalDays,
  onClose,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bookingId =
    propBookingId ||
    searchParams?.get("bookingId") ||
    searchParams?.get("id") ||
    "";

  const [bookingData, setBookingData] = useState(propBookingData || null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(!propBookingData && Boolean(bookingId));

  // 1. Confetti Celebration Effect on Mount
  useEffect(() => {
    // Stage 1: Immediate central burst
    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#EA580C", "#F97316", "#FBBF24", "#10B981", "#3B82F6", "#8B5CF6"],
    });

    // Stage 2: Staggered side fireworks
    const timer1 = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.65 },
        colors: ["#EA580C", "#F97316", "#FBBF24", "#10B981"],
      });
    }, 250);

    const timer2 = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.65 },
        colors: ["#EA580C", "#F97316", "#3B82F6", "#EC4899"],
      });
    }, 450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // 2. Fetch full real booking data if not passed directly
  useEffect(() => {
    if (!bookingData && bookingId) {
      setLoading(true);
      GetBookingById(bookingId)
        .then((res) => {
          if (res?.success && res.data) {
            setBookingData(res.data);
          }
        })
        .catch((err) => {
          console.warn("Failed to load booking details:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [bookingId, bookingData]);

  // Resolve property metadata
  const prop = bookingData?.propertyId || propProperty;
  const rawPropertyType = (
    bookingData?.propertyType ||
    prop?.propertyType ||
    prop?.category?.name ||
    ""
  ).toLowerCase();

  const isHotel =
    rawPropertyType.includes("hotel") ||
    bookingData?.items?.[0]?.unitType === "RoomUnit" ||
    Boolean(prop?.hotelName);

  const isCamping =
    rawPropertyType.includes("camp") ||
    bookingData?.items?.[0]?.unitType === "Tent" ||
    Boolean(prop?.campName);

  const isCottage =
    rawPropertyType.includes("cottage") ||
    bookingData?.items?.[0]?.unitType === "CottageUnit" ||
    Boolean(prop?.cottageTitle);

  const isVilla = !isHotel && !isCamping && !isCottage;

  const displayCategoryTag = (() => {
    if (isHotel) return "PREMIUM HOTEL STAY";
    if (isCamping) return "LAKESIDE CAMPING & GLAMPING";
    if (isCottage) return "PRIVATE SCENIC COTTAGE";
    return "LUXURY PRIVATE VILLA";
  })();

  const bookingCode =
    bookingData?.payoutId?.bookingReference ||
    (bookingId ? `VL-${bookingId.slice(-6).toUpperCase()}` : "VL-928401");

  const displayPropertyName =
    prop?.name ||
    prop?.title ||
    prop?.hotelName ||
    prop?.campName ||
    prop?.cottageTitle ||
    "The Villa Camp Stay";

  const propAddress = prop?.address;
  const displayLocation = propAddress
    ? `${propAddress.city || propAddress.area || "Lonavala"}`
    : prop?.city || "Lonavala";

  const propImage =
    prop?.images?.[0] ||
    prop?.coverImage ||
    prop?.propertyImage ||
    "https://res.cloudinary.com/db60uwvhk/image/upload/v1760612679/villas/ef2977ea-b63b-4a88-b7d0-5a13a2abf906_ggpvlc.jpg";

  const hostName =
    bookingData?.ownerId?.name ||
    bookingData?.ownerId?.fullName ||
    prop?.owner?.name ||
    prop?.owner?.fullName ||
    "Rakesh";

  const customerName = bookingData?.customerDetails
    ? `${bookingData.customerDetails.firstName || ""} ${
        bookingData.customerDetails.lastName || ""
      }`.trim()
    : propCustomer
    ? `${propCustomer.firstName || ""} ${propCustomer.lastName || ""}`.trim()
    : "Verified Guest";

  const customerPhone =
    bookingData?.customerDetails?.mobile ||
    propCustomer?.mobile ||
    "8669186483";

  // Dynamic Badges
  const dynamicChips = useMemo(() => {
    const chips = [];
    const firstItem = bookingData?.items?.[0];
    const bookedUnitTitle =
      firstItem?.typeName ||
      firstItem?.unitName ||
      "";
    const quantity = firstItem?.quantity || 1;
    const qtyPrefix = quantity > 1 ? `${quantity}x ` : "";

    if (isHotel) {
      chips.push({
        id: "unit-type",
        icon: Bed,
        label: bookedUnitTitle ? `${qtyPrefix}${bookedUnitTitle}` : "Hotel Room",
      });
    } else if (isCamping) {
      chips.push({
        id: "unit-type",
        icon: Tent,
        label: bookedUnitTitle ? `${qtyPrefix}${bookedUnitTitle}` : "Lakeside Camp Tent",
      });
    } else if (isCottage) {
      chips.push({
        id: "unit-type",
        icon: Trees,
        label: bookedUnitTitle ? `${qtyPrefix}${bookedUnitTitle}` : "Private Scenic Cottage",
      });
    } else {
      const bhk = (prop?.bhkType || "").toUpperCase();
      const rooms = prop?.rooms;
      if (bhk) {
        chips.push({
          id: "unit-type",
          icon: Home,
          label: `Entire ${bhk.includes("BHK") ? bhk : `${bhk}BHK`} Villa`,
        });
      } else if (rooms && rooms > 0) {
        chips.push({
          id: "unit-type",
          icon: Home,
          label: `Entire ${rooms}-Bedroom Villa`,
        });
      } else {
        chips.push({
          id: "unit-type",
          icon: Home,
          label: "Entire Private Villa",
        });
      }
    }

    const candidateFeatures = [];
    if (Array.isArray(prop?.greatFor)) candidateFeatures.push(...prop.greatFor);
    if (Array.isArray(prop?.topamenities)) candidateFeatures.push(...prop.topamenities);
    if (Array.isArray(prop?.amenities)) candidateFeatures.push(...prop.amenities);

    const added = new Set();
    for (const feat of candidateFeatures) {
      if (chips.length >= 4) break;
      const fLower = String(feat).toLowerCase();
      if (fLower.includes("pool") && !added.has("pool")) {
        added.add("pool");
        chips.push({ id: "pool", icon: Waves, label: fLower.includes("private") ? "Private Pool" : "Swimming Pool" });
      } else if (fLower.includes("lake") && !added.has("lake")) {
        added.add("lake");
        chips.push({ id: "lake", icon: Waves, label: "Lake View" });
      } else if (fLower.includes("wifi") && !added.has("wifi")) {
        added.add("wifi");
        chips.push({ id: "wifi", icon: Wifi, label: "Fast Wi-Fi" });
      } else if (fLower.includes("ac") && !added.has("ac")) {
        added.add("ac");
        chips.push({ id: "ac", icon: Wind, label: "Air Conditioned" });
      } else if (fLower.includes("bonfire") && !added.has("bonfire")) {
        added.add("bonfire");
        chips.push({ id: "bonfire", icon: Flame, label: "Bonfire & BBQ" });
      }
    }

    if (chips.length < 3) {
      chips.push({ id: "caretaker", icon: ShieldCheck, label: "Verified Caretaker" });
      chips.push({ id: "wifi-fb", icon: Wifi, label: "Free Wi-Fi" });
    }

    return chips.slice(0, 4);
  }, [bookingData, isHotel, isCamping, isCottage, isVilla, prop]);

  // Pricing calculations
  const pricing = bookingData?.pricing || propPricing;
  const rawTotal =
    pricing?.totalAmount ||
    pricing?.totalPrice ||
    36170;
  const formattedTotal = `₹${Number(rawTotal).toLocaleString("en-IN")}`;

  const payments = bookingData?.payments || [];
  const successfulPayment =
    payments.find((p) => p.status === "successful") || payments[0];
  const transactionId =
    successfulPayment?.transactionId ||
    bookingData?.razorpayPaymentId ||
    `TXN_${Date.now().toString().slice(-10)}`;

  // Dates
  const checkInRaw = bookingData?.checkIn || propCheckIn;
  const checkOutRaw = bookingData?.checkOut || propCheckOut;
  const checkInDate = checkInRaw ? new Date(checkInRaw) : null;
  const checkOutDate = checkOutRaw ? new Date(checkOutRaw) : null;

  const formatDateDisplay = (date, fallback) => {
    if (!date || isNaN(date.getTime())) return fallback;
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const checkInFormatted = formatDateDisplay(checkInDate, "Fri, 25 Oct");
  const checkOutFormatted = formatDateDisplay(checkOutDate, "Sun, 27 Oct");

  const nights =
    propTotalDays ||
    (checkInDate && checkOutDate
      ? Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 86400000))
      : 2);

  const adults = bookingData?.guests?.adults || bookingData?.adultsCount || 4;

  const subtotal = pricing?.subtotal || Math.round(rawTotal * 0.83);
  const pricePerNight = Math.round(subtotal / nights);
  const cleaningFee = pricing?.mealExtraCharge || pricing?.cleaningFee || 1500;
  const taxes = pricing?.taxAmount || pricing?.taxes || Math.round(subtotal * 0.18);
  const discount = pricing?.discountAmount || pricing?.discount || 0;

  const handleCopyTxn = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(transactionId);
      }
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#121C2A] flex flex-col antialiased selection:bg-[#EA580C] selection:text-white">
      {/* 1. Fixed / Sticky Top Header (Mobile Only, Hidden on Desktop) */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-black/[0.06] shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#121C2A] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <h1 className="text-base sm:text-lg font-bold text-[#121C2A]">
            Booking Confirmed
          </h1>

          <div className="w-10 h-10 rounded-full bg-[#EA580C] text-white flex items-center justify-center shadow-sm">
            <User className="w-5 h-5" />
          </div>
        </div>
      </header>

      {/* 2. Main Container (Responsive Mobile & Desktop) */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {/* Hero Celebration Section */}
        <div className="flex flex-col items-center text-center py-2 sm:py-4">
          {/* Status Emblem with Glow */}
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#EA580C] to-[#F97316] text-white flex items-center justify-center shadow-xl shadow-[#EA580C]/30 animate-in zoom-in-75 duration-300">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-[#EA580C]">
              <Sparkles className="w-3.5 h-3.5 fill-[#EA580C]" />
            </div>
          </div>

          {/* Verification Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFEDD5] border border-[#FED7AA] text-xs font-semibold text-[#121C2A] mb-3 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-ping" />
            <span>Reservation #{bookingCode}</span>
            <span className="text-[#8E7166]">•</span>
            <span className="inline-flex items-center gap-1 text-[#EA580C] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Confirmed
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#121C2A] tracking-tight">
            Booking Confirmed!
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#5A4138] max-w-md leading-relaxed">
            Pack your bags! Your peaceful escape to{" "}
            <span className="font-bold text-[#121C2A]">
              {displayPropertyName}
            </span>{" "}
            in {displayLocation} is locked in.
          </p>
        </div>

        {/* Desktop 2-Column Grid vs Mobile Single Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Property Details, Schedule, Guest, Mobile CTAs) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Property Summary Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex gap-4 items-center">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-100 shadow-inner">
                  <img
                    src={propImage}
                    alt={displayPropertyName}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#27313F]/85 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    <Star className="w-3 h-3 fill-[#FFB800] text-[#FFB800]" />
                    <span>4.94</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] font-extrabold tracking-wider text-[#EA580C] uppercase">
                    {displayCategoryTag}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#121C2A] truncate">
                    {displayPropertyName}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#8E7166] shrink-0" />
                    <span>{displayLocation}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <div className="w-5 h-5 rounded-full bg-[#FFDBCA] text-[#783200] font-extrabold text-[10px] flex items-center justify-center shrink-0">
                      {hostName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs text-[#121C2A] truncate font-medium">
                      Hosted by {hostName}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F2E0C8] text-[#504534]">
                      Superhost
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Badges Carousel */}
              {dynamicChips.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                  {dynamicChips.map((chip) => {
                    const ChipIcon = chip.icon;
                    return (
                      <div
                        key={chip.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F5F9] text-xs font-semibold text-[#121C2A]"
                      >
                        <ChipIcon className="w-3.5 h-3.5 text-[#EA580C]" />
                        <span>{chip.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Stay Schedule Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-[#121C2A]">
                  Stay Schedule
                </h3>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFEDD5] text-[#EA580C]">
                  {nights} {nights === 1 ? "Night" : "Nights"} • {adults} Guests
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#F8FAFC] p-3 rounded-xl border border-slate-100">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 tracking-wider">
                    <LogIn className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>CHECK-IN</span>
                  </div>
                  <p className="text-sm font-bold text-[#121C2A] mt-1">
                    {checkInFormatted}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">From 02:00 PM</p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 tracking-wider">
                    <LogOut className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>CHECK-OUT</span>
                  </div>
                  <p className="text-sm font-bold text-[#121C2A] mt-1">
                    {checkOutFormatted}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Until 11:00 AM</p>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1 text-xs text-[#121C2A]">
                <Clock className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                <p>
                  <span className="font-bold">Early Check-in</span> subject to availability upon arrival at the property.
                </p>
              </div>
            </div>

            {/* Guest Details Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-[#121C2A]">
                  Guest Details
                </h3>
                <User className="w-5 h-5 text-[#8E7166]" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#121C2A]">
                    {customerName}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    +91 {customerPhone}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#EFF4FF] text-[#1D4ED8]">
                  Primary Guest
                </span>
              </div>

              <div className="pt-2">
                <a
                  href="tel:+919800000000"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-bold text-[#121C2A] hover:bg-slate-100 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>Call Host Directly</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column (Tear-Off Ticket Motif Payment Card & Primary Actions) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Tear-Off Ticket Motif Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden">
              {/* Ticket Top Section */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#121C2A]">
                    Payment Summary
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FFEDD5] text-[#EA580C]">
                    All Inclusive
                  </span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm pt-1">
                  <div className="flex justify-between text-[#5A4138]">
                    <span>₹{pricePerNight.toLocaleString("en-IN")} × {nights} {nights === 1 ? "night" : "nights"}</span>
                    <span className="font-semibold text-[#121C2A]">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-[#5A4138]">
                    <span>Cleaning & Hospitality Fee</span>
                    <span className="font-semibold text-[#121C2A]">₹{cleaningFee.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-[#5A4138]">
                    <span>Taxes & GST (18%)</span>
                    <span className="font-semibold text-[#121C2A]">₹{taxes.toLocaleString("en-IN")}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#EA580C] font-semibold">
                      <span>Promo Discount</span>
                      <span>-₹{discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Scalloped / Dashed Tear-Off Ticket Divider */}
              <div className="relative flex items-center justify-center h-6 my-1">
                {/* Left Scalloped Cutout */}
                <div className="absolute -left-3 w-6 h-6 rounded-full bg-[#F8F9FF] border border-slate-200/80 z-10" />
                {/* Dashed Center Cut Line */}
                <div className="w-full border-b-[1.5px] border-dashed border-[#E2BFB2] mx-4" />
                {/* Right Scalloped Cutout */}
                <div className="absolute -right-3 w-6 h-6 rounded-full bg-[#F8F9FF] border border-slate-200/80 z-10" />
              </div>

              {/* Ticket Bottom Section */}
              <div className="p-5 bg-slate-50/50 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-bold text-[#121C2A]">
                    Total Paid
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#EA580C]">
                    {formattedTotal}
                  </span>
                </div>

                {/* Payment Method Container */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FFF7ED] flex items-center justify-center text-[#EA580C] shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#121C2A]">
                        UPI / Razorpay Verified
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Official Instant Gateway Payment
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFDBCA] text-[#9D4300]">
                    Paid
                  </span>
                </div>

                {/* Txn ID with Copy Action */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span className="truncate pr-2">
                    Txn ID: <code className="font-mono text-[#121C2A] font-semibold">{transactionId}</code>
                  </span>
                  <button
                    onClick={handleCopyTxn}
                    className="inline-flex items-center gap-1 text-[#EA580C] font-bold hover:underline cursor-pointer shrink-0"
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-2">
              <Link
                href="/booking"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#F97316] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#EA580C]/25 hover:opacity-95 transition-all cursor-pointer"
              >
                <span>Go to Reservation Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={handleClose}
                className="w-full py-2.5 text-center text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Return to Home Exploration
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
