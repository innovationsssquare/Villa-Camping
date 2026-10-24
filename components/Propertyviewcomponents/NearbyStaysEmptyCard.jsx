"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Compass, ArrowRight, Home } from "lucide-react";
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
      className={`w-full rounded-2xl border border-neutral-200 bg-white transition-all duration-300 ${
        isMobile ? "p-5 text-center" : "p-8 sm:p-10 text-center"
      }`}
    >
      <div className="max-w-lg mx-auto flex flex-col items-center">
        {/* Clean Neutral Icon */}
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-neutral-100 border border-neutral-200/80 flex items-center justify-center text-neutral-800 mb-3.5">
          <Compass className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>

        {/* Location pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 text-[11px] sm:text-xs font-semibold mb-3">
          <MapPin className="w-3.5 h-3.5 text-neutral-500" />
          <span>{locationName}</span>
          {parsedCoords && (
            <span className="text-neutral-500 font-normal">
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

        {/* Action Button - Brand Theme */}
        <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#FF5A1F] hover:bg-[#E04812] text-white text-xs sm:text-sm font-semibold active:scale-95 transition-all duration-200"
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
