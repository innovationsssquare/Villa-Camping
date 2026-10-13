"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Compass, Sparkles, ArrowRight, Home } from "lucide-react";
import { parseCoordinates } from "@/lib/nearbyStaysUtils";

export default function NearbyStaysEmptyCard({
  locationName = "this destination",
  propertyType = "Stay",
  coordinates = null,
  isMobile = false,
}) {
  const parsedCoords = parseCoordinates(coordinates);
  const pluralType =
    propertyType.toLowerCase() === "villa"
      ? "villas"
      : propertyType.toLowerCase() === "campsite" || propertyType.toLowerCase() === "camping"
      ? "campsites"
      : propertyType.toLowerCase() === "cottage"
      ? "cottages"
      : propertyType.toLowerCase() === "hotel"
      ? "hotels"
      : "stays";

  return (
    <div
      className={`relative w-full rounded-2xl border border-dashed border-orange-200 bg-gradient-to-br from-orange-50/50 via-white to-neutral-50/60 transition-all duration-300 overflow-hidden shadow-sm ${
        isMobile ? "p-5 text-center" : "p-8 sm:p-10 text-center"
      }`}
    >
      {/* Decorative ambient background blur */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-orange-300/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-amber-300/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
        {/* Icon with glowing badge */}
        <div className="relative mb-3.5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#ff6900]/15 via-orange-100 to-[#ff6900]/5 flex items-center justify-center text-[#ff6900] shadow-sm ring-1 ring-[#ff6900]/25">
            <Compass className="w-7 h-7 sm:w-8 sm:h-8 animate-[spin_12s_linear_infinite]" />
          </div>
          <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-orange-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </span>
        </div>

        {/* Location pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/70 border border-orange-200/80 text-orange-800 text-[11px] sm:text-xs font-semibold mb-3">
          <MapPin className="w-3.5 h-3.5 text-[#ff6900]" />
          <span>{locationName}</span>
          {parsedCoords && (
            <span className="text-orange-600 font-normal">
              • {parsedCoords.lat.toFixed(2)}°N, {parsedCoords.lng.toFixed(2)}°E
            </span>
          )}
        </div>

        {/* Heading */}
        <h4 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
          No other {pluralType} found in {locationName} yet
        </h4>

        {/* Description */}
        <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 leading-relaxed max-w-md">
          This is currently our featured {propertyType.toLowerCase()} in this
          area. We are continuously handpicking and verifying new luxury stays
          within this radius.
        </p>

        {/* Action Button */}
        <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#ff6900] to-[#e05d00] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md hover:brightness-105 active:scale-95 transition-all duration-200"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Explore All Stays</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
