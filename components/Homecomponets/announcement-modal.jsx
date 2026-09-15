"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BaseUrl } from "@/lib/API/Baseurl";
import { Sparkles, X, Copy, Check, ArrowRight, Tag } from "lucide-react";

export default function AnnouncementModal() {
  const [popupData, setPopupData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPopup = async () => {
      try {
        const res = await fetch(`${BaseUrl}/OfferEvent/active`);
        if (!res.ok) return;
        const json = await res.json();
        // STRICT RULE: Only Admin-created announcements/offers can trigger the homepage visitor popup!
        if (
          json &&
          json.popupItem &&
          json.popupItem.isActive &&
          json.popupItem.creatorRole === "admin"
        ) {
          const promoKey = `thevillacamp_promo_seen_${json.popupItem._id || "v1"}`;
          const alreadySeen = sessionStorage.getItem(promoKey);
          if (alreadySeen) return;

          setPopupData(json.popupItem);
          // Smooth entrance after page content stabilizes
          const timer = setTimeout(() => {
            setIsOpen(true);
          }, 1200);
          return () => clearTimeout(timer);
        }
      } catch (err) {
        console.warn("Failed to load promo popup:", err);
      }
    };

    fetchPopup();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      if (popupData?._id) {
        sessionStorage.setItem(`thevillacamp_promo_seen_${popupData._id}`, "true");
      }
      sessionStorage.setItem("thevillacamp_promo_popup_seen", "true");
    } catch (e) {}
  };

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen || !popupData) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-300"
      onClick={handleClose}
    >
      {/* 
        Airbnb-Inspired Centered Card:
        - Compact responsive height so it floats with generous breathing room top & bottom
        - Max height capped with smooth scroll fallback if screen is very short
        - Seamless 3D illustration blend via mix-blend-multiply
        - Modern rounded-[28px] sm:rounded-[32px] corners
      */}
      <div
        className="relative w-full max-w-[390px] sm:max-w-[420px] max-h-[calc(100dvh-2.5rem)] sm:max-h-[calc(100dvh-3.5rem)] bg-white rounded-[28px] sm:rounded-[32px] border border-neutral-150/90 shadow-2xl shadow-neutral-900/25 overflow-y-auto text-center my-auto animate-in zoom-in-95 duration-300 no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft Warm Ambient Glow at the Top */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-b from-orange-200/40 via-rose-100/25 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Circular Close Button (Top-Right) */}
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-100/90 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          aria-label="Close promotion modal"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
        </button>

        <div className="relative pt-4 sm:pt-5 px-5 sm:px-7 pb-5 sm:pb-6 space-y-3 sm:space-y-3.5">
          {/* Top 3D Artwork Section with seamless background blending */}
          <div className="relative flex justify-center items-center h-32 sm:h-38 md:h-40 select-none">
            <img
              src={popupData.bannerImage || "/Homeasset/isometric_luxury_villa.jpg"}
              alt={popupData.title || "Luxury Stay Promotion"}
              className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105 drop-shadow-sm mix-blend-multiply"
            />
          </div>

          {/* Badge & Typography */}
          <div className="space-y-1.5">
            {popupData.discountBadge && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200/80 text-[#ff6900] text-[10.5px] font-extrabold uppercase tracking-wider shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#ff6900]" />
                <span>{popupData.discountBadge}</span>
              </div>
            )}

            <h2 className="text-xl sm:text-[23px] font-black text-neutral-900 tracking-tight leading-snug">
              {popupData.title || "Take 10% off your next stay"}
            </h2>

            {popupData.propertyName && (
              <span className="inline-block text-[11px] font-semibold text-neutral-500">
                📍 {popupData.propertyName}
              </span>
            )}

            <p className="text-[11.5px] sm:text-[12.5px] text-neutral-500 max-w-xs mx-auto leading-relaxed line-clamp-2">
              {popupData.description ||
                "Special seasonal discount on luxury private pool villas and lakeside stays. Limited period offer."}
            </p>
          </div>

          {/* Coupon Code Section */}
          {popupData.couponCode && (
            <div className="p-2 sm:p-2.5 rounded-xl bg-neutral-50/90 border border-dashed border-[#ff6900]/40 flex items-center justify-between gap-2 shadow-2xs">
              <div className="text-left pl-1.5">
                <span className="text-[9.5px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5 text-[#ff6900]" /> Coupon Code
                </span>
                <span className="font-mono text-xs sm:text-sm font-black text-[#ff6900] tracking-wider block">
                  {popupData.couponCode}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopyCode(popupData.couponCode)}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ff6900] to-[#e05d00] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Primary CTA Button & Secondary Dismiss */}
          <div className="pt-1 space-y-2">
            <Link
              href={popupData.ctaLink || "/category/all"}
              onClick={handleClose}
              className="w-full h-10 sm:h-11 rounded-xl bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c84d00] active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              <span>{popupData.ctaText || "Claim Offer & Explore Stays"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleClose}
              className="text-[11px] text-neutral-400 hover:text-neutral-600 font-medium transition-colors cursor-pointer"
            >
              Maybe later • Terms apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
