"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
} from "lucide-react";
import { getDisplayPrice } from "./getDisplayPrice";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist, optimisticToggle } from "@/Redux/Slices/wishlistSlice";
import { buildPropertyViewUrl } from "@/lib/categoryUtils";

export const PropertyCard = ({
  property,
  onClose,
  compact = false,
  horizontal = false,
  isHovered = false,
  isActive = false,
  onClick,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { selectedCategoryName, checkin, checkout } = useSelector(
    (state) => state.booking || {}
  );
  const categories = useSelector((state) => state.category?.categories || []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [localLiked, setLocalLiked] = useState(false);

  // Redux Wishlist integration
  const wishlistIds = useSelector((state) => state.wishlist?.ids || []);
  const user = useSelector((state) => state.auth?.user || null);
  const propertyId = property.id || property._id;
  const propertyType = property.type || property.category || "villa";

  const isLikedInStore = useMemo(() => {
    if (!wishlistIds || !Array.isArray(wishlistIds)) return false;
    const key = `${propertyType?.toLowerCase()}:${propertyId}`;
    return (
      wishlistIds.includes(propertyId) ||
      wishlistIds.includes(key) ||
      wishlistIds.some((item) => item?.propertyId === propertyId)
    );
  }, [wishlistIds, propertyId, propertyType]);

  const isLiked = isLikedInStore || localLiked;

  const handleWishlist = (e) => {
    e.stopPropagation();
    setLocalLiked(!localLiked);

    if (user?._id) {
      dispatch(
        optimisticToggle({
          propertyId,
          propertyType,
        })
      );
      dispatch(
        toggleWishlist({
          propertyId,
          propertyType,
          userId: user._id,
        })
      );
    }
  };

  const images = useMemo(() => {
    if (
      property.images &&
      Array.isArray(property.images) &&
      property.images.length > 0
    ) {
      return property.images;
    }
    if (property.image) return [property.image];
    return ["/placeholder.svg"];
  }, [property]);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Direct Routing to View Property Page for all cards
  const navigateToProperty = (e) => {
    e?.stopPropagation?.();
    if (onClick) {
      onClick(property);
    }
    const targetId = property.id || property._id;
    if (!targetId) return;

    const url = buildPropertyViewUrl(
      property,
      categories,
      selectedCategoryName,
      checkin,
      checkout
    );
    router.push(url);
  };

  function formatRupee(amount) {
    if (amount == null || Number.isNaN(Number(amount))) return "₹0";
    return `₹${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Number(amount))}`;
  }

  const basePrice = getDisplayPrice(property.price);
  const twoNightsPrice = basePrice * 2;

  const propertyTypeName = property.type
    ? property.type.charAt(0).toUpperCase() + property.type.slice(1)
    : "Stay";

  /* ========================================================================= */
  /* 1. COMPACT CARD (Mobile Bottom Sheet / Drawer)                            */
  /* ========================================================================= */
  if (compact) {
    return (
      <div
        onClick={navigateToProperty}
        className={`group relative bg-white rounded-2xl border transition-all duration-200 p-2.5 flex gap-3 cursor-pointer ${
          isActive
            ? "border-2 border-[#ff6900] shadow-md"
            : "border-neutral-200/90 hover:border-black/20 shadow-xs"
        }`}
      >
        <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-neutral-100">
          <img
            src={images[0] || "/placeholder.svg"}
            alt={property.title || "Stay"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-1.5 left-1.5 z-10">
            <span className="text-[9px] font-bold text-neutral-900 bg-white/95 px-1.5 py-0.5 rounded-full border border-black/5 shadow-xs capitalize">
              {property.type || "Stay"}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
          <div>
            <div className="flex items-start justify-between gap-1.5">
              <h4 className="font-bold text-sm text-neutral-900 truncate leading-snug">
                {property.title}
              </h4>
              <div className="flex items-center gap-0.5 shrink-0 text-neutral-900 font-semibold text-xs">
                <Star className="w-3 h-3 fill-black text-black" />
                <span>{property.rating?.average || "4.92"}</span>
              </div>
            </div>

            <div className="text-xs text-neutral-500 truncate mt-1">
              <span>{property.location}</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2 mt-2 pt-1.5 border-t border-neutral-100">
            <div>
              <span className="text-base font-black text-neutral-900">
                {formatRupee(basePrice)}
              </span>
              <span className="text-xs text-neutral-500 ml-1">night</span>
            </div>

            <button
              type="button"
              onClick={navigateToProperty}
              className="h-7 px-3 rounded-lg bg-black text-white font-bold text-[11px] active:scale-95 cursor-pointer"
            >
              View
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ========================================================================= */
  /* 2. MARKER POPUP PREVIEW CARD (Small & Compact for Map Overview)           */
  /* ========================================================================= */
  if (onClose) {
    return (
      <div
        onClick={navigateToProperty}
        className="relative w-[230px] sm:w-[245px] bg-white rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.22)] overflow-hidden border border-neutral-200/90 animate-in fade-in zoom-in-95 duration-200 cursor-pointer select-none hover:shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition-shadow"
      >
        {/* Top Image (Compact h-32) */}
        <div className="relative h-32 w-full overflow-hidden bg-neutral-100">
          <img
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={property.title || "Stay"}
            className="w-full h-full object-cover transition-transform duration-300 ease-out"
          />

          {/* Top-Right Circular Action Buttons (Heart + Close X) */}
          <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5">
            {/* Wishlist Heart */}
            <button
              type="button"
              onClick={handleWishlist}
              className="w-6 h-6 rounded-full bg-white/95 backdrop-blur-md shadow-xs flex items-center justify-center hover:scale-110 active:scale-90 transition-transform cursor-pointer border border-black/5"
              aria-label="Wishlist"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${
                  isLiked
                    ? "fill-[#ff6900] text-[#ff6900]"
                    : "text-neutral-700 stroke-[2]"
                }`}
              />
            </button>

            {/* Close Button X */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-6 h-6 rounded-full bg-white/95 backdrop-blur-md shadow-xs flex items-center justify-center hover:scale-110 active:scale-90 transition-transform cursor-pointer border border-black/5 text-neutral-800"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Left/Right Carousel Controls */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-sm flex items-center justify-center cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-sm flex items-center justify-center cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-3 h-3" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-black/30 backdrop-blur-xs px-2 py-0.5 rounded-full">
                {images.slice(0, 5).map((_, idx) => (
                  <span
                    key={idx}
                    className={`rounded-full transition-all ${
                      idx === currentImageIndex
                        ? "w-1.5 h-1.5 bg-white scale-125"
                        : "w-1 h-1 bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Text Details (Compact) */}
        <div className="p-2.5 flex flex-col">
          {/* Line 1: Type in Location + Star Rating */}
          <div className="flex items-baseline justify-between gap-1 mb-0.5">
            <span className="font-bold text-neutral-900 text-xs truncate">
              {propertyTypeName} in {property.location || "Maharashtra"}
            </span>
            <div className="flex items-center gap-0.5 shrink-0 text-neutral-900 font-bold text-[11px]">
              <Star className="w-3 h-3 fill-black text-black" />
              <span>
                {property.rating?.average
                  ? `${property.rating.average} (${property.rating.count || 6})`
                  : "5.0 (6)"}
              </span>
            </div>
          </div>

          {/* Line 2: Property title / Tagline */}
          <p className="text-neutral-500 text-[11px] truncate mb-0.5">
            {property.title}
          </p>

          {/* Line 3: Dates */}
          <p className="text-neutral-600 text-[10px] font-medium mb-1">
            6–8 Nov
          </p>

          {/* Line 4: Price */}
          <div className="flex items-baseline gap-1 pt-1 border-t border-neutral-100">
            <span className="font-extrabold text-neutral-900 text-xs">
              {formatRupee(twoNightsPrice || basePrice)}
            </span>
            <span className="text-neutral-600 text-[10px] font-normal">
              for 2 nights
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* ========================================================================= */
  /* 3. HORIZONTAL CARD (Airbnb Split-Screen Style)                            */
  /* ========================================================================= */
  if (horizontal) {
    return (
      <div
        onClick={navigateToProperty}
        className={`group relative flex flex-col sm:flex-row bg-white rounded-2xl transition-all duration-200 cursor-pointer select-none p-3 gap-4 border ${
          isActive
            ? "border-2 border-[#ff6900] shadow-md ring-1 ring-[#ff6900]/20 bg-orange-50/10"
            : "border-neutral-200/80 hover:border-neutral-300 hover:shadow-xs"
        }`}
      >
        {/* Left Side: Photo Carousel */}
        <div className="relative w-full sm:w-60 md:w-64 h-48 shrink-0 rounded-xl overflow-hidden bg-neutral-100">
          <img
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={property.title || "Stay"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Top-Left Guest favourite */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-md text-neutral-900 shadow-xs border border-black/5">
              Guest favourite
            </span>
          </div>

          {/* Top-Right Heart */}
          <button
            type="button"
            onClick={handleWishlist}
            className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center hover:scale-110 active:scale-90 transition-transform cursor-pointer"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isLiked
                  ? "fill-[#ff6900] text-[#ff6900]"
                  : "text-neutral-800 stroke-[2]"
              }`}
            />
          </button>

          {/* Carousel dots */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-black/25 backdrop-blur-xs px-2 py-0.5 rounded-full">
              {images.slice(0, 5).map((_, idx) => (
                <span
                  key={idx}
                  className={`rounded-full transition-all ${
                    idx === currentImageIndex
                      ? "w-1.5 h-1.5 bg-white scale-125"
                      : "w-1 h-1 bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Details */}
        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
          <div>
            {/* Title & Star Rating */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-neutral-900 text-base leading-snug truncate">
                {propertyTypeName} in {property.location || "Maharashtra"}
              </h3>
              <div className="flex items-center gap-1 shrink-0 text-neutral-900 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-black text-black" />
                <span>
                  {property.rating?.average
                    ? `${property.rating.average} (${property.rating.count || 118})`
                    : "4.88 (118)"}
                </span>
              </div>
            </div>

            {/* Tagline / Subtitle */}
            <p className="text-neutral-500 text-xs truncate mb-2">
              {property.title}
            </p>

            {/* Specs: Bedroom · Bed · Bathroom */}
            <p className="text-neutral-500 text-xs truncate mb-1">
              {property.rooms ? `${property.rooms} bedroom${property.rooms > 1 ? "s" : ""}` : "1 bedroom"}
              {" · "}
              {property.maxCapacity ? `upto ${property.maxCapacity} guests` : "1 bed"}
              {property.baths ? ` · ${property.baths} private bathroom${property.baths > 1 ? "s" : ""}` : " · 1 private bathroom"}
            </p>

            {/* Dates */}
            <p className="text-neutral-500 text-xs mb-2">
              6–8 Nov
            </p>
          </div>

          {/* Price */}
          <div className="pt-2 border-t border-neutral-100 flex items-baseline justify-between gap-2">
            <div>
              <span className="font-extrabold text-neutral-900 text-base">
                {formatRupee(twoNightsPrice || basePrice)}
              </span>
              <span className="text-neutral-600 text-xs ml-1">
                for 2 nights
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ========================================================================= */
  /* 4. DEFAULT: VERTICAL AIRBNB CARD (With Active Orange Border)               */
  /* ========================================================================= */
  return (
    <div
      onClick={navigateToProperty}
      className={`group relative flex flex-col bg-white rounded-2xl transition-all duration-200 cursor-pointer select-none p-2.5 border ${
        isActive
          ? "border-2 border-[#ff6900] shadow-md ring-1 ring-[#ff6900]/20 bg-orange-50/10"
          : "border-neutral-200/80 hover:border-neutral-300 hover:shadow-xs"
      }`}
    >
      {/* 1. Image Carousel Container */}
      <div className="relative aspect-[20/19] w-full rounded-xl overflow-hidden bg-neutral-100 mb-3">
        <img
          src={images[currentImageIndex] || "/placeholder.svg"}
          alt={property.title || "Stay"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top-Left: Guest favourite badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-neutral-900 shadow-xs border border-black/5">
            Guest favourite
          </span>
        </div>

        {/* Top-Right: Wishlist Heart icon */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center transition-transform hover:scale-115 active:scale-90 cursor-pointer"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-5 h-5 drop-shadow-xs transition-colors ${
              isLiked
                ? "fill-[#ff6900] text-[#ff6900]"
                : "text-neutral-800 stroke-white stroke-[2] fill-black/20"
            }`}
          />
        </button>

        {/* Prev / Next buttons on hover */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Indicator dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-black/25 backdrop-blur-xs px-2 py-1 rounded-full">
              {images.slice(0, 5).map((_, idx) => (
                <span
                  key={idx}
                  className={`rounded-full transition-all ${
                    idx === currentImageIndex
                      ? "w-1.5 h-1.5 bg-white scale-125"
                      : "w-1 h-1 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 2. Text Content */}
      <div className="flex flex-col text-[14px] leading-tight px-1 pb-1">
        {/* Line 1: Type in Location (bold) + Star rating */}
        <div className="flex items-baseline justify-between gap-1 mb-0.5">
          <span className="font-bold text-neutral-900 truncate">
            {propertyTypeName} in {property.location || "Maharashtra"}
          </span>
          <div className="flex items-center gap-1 shrink-0 text-neutral-900 font-semibold text-xs">
            <Star className="w-3.5 h-3.5 fill-black text-black" />
            <span>
              {property.rating?.average
                ? `${property.rating.average} (${property.rating.count || 52})`
                : "4.92 (52)"}
            </span>
          </div>
        </div>

        {/* Line 2: Property Title / Stay description */}
        <p className="text-neutral-500 text-xs truncate mb-0.5">
          {property.title}
        </p>

        {/* Line 3: Specs: bedroom · beds · bathrooms */}
        <p className="text-neutral-500 text-xs truncate mb-0.5">
          {property.rooms ? `${property.rooms} bedroom${property.rooms > 1 ? "s" : ""}` : "1 bedroom"}
          {" · "}
          {property.maxCapacity ? `upto ${property.maxCapacity} guests` : "2 beds"}
          {property.baths ? ` · ${property.baths} bathroom${property.baths > 1 ? "s" : ""}` : " · 2 bathrooms"}
        </p>

        {/* Line 4: Dates / Availability */}
        <p className="text-neutral-500 text-xs mb-1">
          Available this weekend
        </p>

        {/* Line 5: Price */}
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="font-bold text-neutral-900 text-[15px]">
            {formatRupee(basePrice)}
          </span>
          <span className="text-neutral-700 text-xs font-normal">
            night
          </span>
        </div>
      </div>
    </div>
  );
};
