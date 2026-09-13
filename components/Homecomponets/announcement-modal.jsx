"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BaseUrl } from "@/lib/API/Baseurl";
import { Sparkles, X, Copy, Check, ArrowRight, Tag, Calendar, ShieldAlert } from "lucide-react";

export default function AnnouncementModal() {
  const [popupData, setPopupData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const alreadySeen = sessionStorage.getItem("thevillacamp_promo_popup_seen");
      if (alreadySeen) return;

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
            setPopupData(json.popupItem);
            // Delay popup by 2.5 seconds for smooth non-jarring entrance
            const timer = setTimeout(() => {
              setIsOpen(true);
            }, 2500);
            return () => clearTimeout(timer);
          }
        } catch (err) {
          console.warn("Failed to load promo popup:", err);
        }
      };

      fetchPopup();
    } catch (e) {}
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/75 backdrop-blur-md overflow-hidden"
      onClick={handleClose}
    >
      {/* 
        Horizontal Landscape Container:
        - Centered vertically and horizontally
        - Strict max-height 85vh to guarantee it NEVER touches viewport top or bottom
        - No overflow on container; internal body scrolls if needed on smaller screens
      */}
      <div
        className="relative w-full max-w-4xl max-h-[85vh] bg-neutral-950 text-white rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto animate-in zoom-in-95 fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-black/70 hover:bg-neutral-800 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
          aria-label="Close announcement"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT COLUMN: Visual Banner (Horizontal half on md+) */}
        <div className="relative md:w-5/12 h-44 sm:h-52 md:h-auto min-h-[220px] bg-neutral-900 overflow-hidden shrink-0">
          <img
            src={popupData.bannerImage}
            alt={popupData.title}
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-neutral-950/90 via-neutral-950/20 to-transparent" />

          {/* Badges on Banner */}
          <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/95 text-neutral-900 backdrop-blur-md shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
              Official Announcement
            </span>

            {popupData.discountBadge && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#ff6900] text-white shadow-md">
                {popupData.discountBadge}
              </span>
            )}
          </div>

          {popupData.propertyName && (
            <div className="absolute bottom-3 left-3 right-3 z-10">
              <span className="text-xs font-semibold text-orange-300 tracking-wide line-clamp-1">
                📍 {popupData.propertyName}
              </span>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Content & Actions (Scrollable if viewport is tight) */}
        <div className="md:w-7/12 p-5 sm:p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[calc(85vh-10px)] space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#ff6900]">
                {popupData.type === "event" ? "Exclusive Event" : "Seasonal Promotion"}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-tight leading-snug">
              {popupData.title}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {popupData.description}
            </p>
          </div>

          {/* Coupon Code Section (Admin only offers) */}
          {popupData.couponCode && (
            <div className="p-3 sm:p-3.5 rounded-2xl bg-white/5 border border-dashed border-orange-500/40 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#ff6900]" /> Coupon Code
                </span>
                <span className="font-mono text-base font-extrabold text-[#ff6900] tracking-wider block">
                  {popupData.couponCode}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopyCode(popupData.couponCode)}
                className="px-3.5 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href={popupData.ctaLink || "/category/all"}
              onClick={handleClose}
              className="flex-1 h-11 sm:h-12 rounded-xl bg-[#ff6900] hover:bg-[#e05d00] active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>{popupData.ctaText || "Explore & Claim Offer"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={handleClose}
              className="h-11 sm:h-12 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white font-semibold text-xs border border-white/10 transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
