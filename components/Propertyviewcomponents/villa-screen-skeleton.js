"use client";

import React from "react";
import { Skeleton } from "@heroui/react";

/**
 * Modern, luxury Desktop Property Skeleton
 * Matches the actual desktop layout:
 * - Desktop navigation header
 * - 4-column Hero Image Gallery (3 cols main image + 1 col 2 stacked images)
 * - Sticky tabs navigation bar
 * - 2-column content grid (Left: Details, Spaces, Amenities, Reviews; Right: Sticky Booking Widget)
 */
function DesktopPropertySkeleton() {
  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      {/* 1. Desktop Navbar Skeleton */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Skeleton className="h-9 w-32 rounded-xl" />
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-full border border-gray-200 bg-gray-50/80 w-72">
              <Skeleton className="h-4 w-24 rounded-md" />
              <div className="h-3 w-px bg-gray-300" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full border border-gray-200" />
          </div>
        </div>
      </header>

      <main className="w-full mx-auto">
        {/* 2. Hero Gallery Grid (Matches PremiumPropertyHero exactly: 4 columns) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-5 w-48 rounded-md" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[60vh] sm:h-[65vh] lg:h-[70vh] min-h-[420px] max-h-[640px]">
            {/* Left 3 Columns: Main Hero Image */}
            <div className="md:col-span-3 h-full relative rounded-2xl overflow-hidden bg-gray-200/90 group">
              <Skeleton className="w-full h-full rounded-2xl" />
              {/* Bottom rating & buttons overlay */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <Skeleton className="h-7 w-28 rounded-full bg-white/70 backdrop-blur-sm" />
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Skeleton className="h-9 w-9 rounded-full bg-white/70 backdrop-blur-sm" />
                <Skeleton className="h-9 w-9 rounded-full bg-white/70 backdrop-blur-sm" />
              </div>
            </div>

            {/* Right 1 Column: 2 Stacked Images */}
            <div className="md:col-span-1 flex flex-col gap-4 h-full min-h-0">
              <div className="relative flex-1 min-h-0 rounded-2xl overflow-hidden bg-gray-200/90">
                <Skeleton className="w-full h-full rounded-2xl" />
                <div className="absolute top-3 right-3">
                  <Skeleton className="h-6 w-20 rounded-full bg-white/70 backdrop-blur-sm" />
                </div>
              </div>
              <div className="relative flex-1 min-h-0 rounded-2xl overflow-hidden bg-gray-200/90">
                <Skeleton className="w-full h-full rounded-2xl" />
                <div className="absolute bottom-3 right-3">
                  <Skeleton className="h-8 w-28 rounded-xl bg-white/80 backdrop-blur-sm" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Sticky Tabs Navigation */}
        <div className="sticky top-18 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-8 h-14">
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>
        </div>

        {/* 4. 2-Column Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column (2 cols): Main details */}
            <div className="lg:col-span-2 space-y-10">
              {/* Title & Stats */}
              <div className="space-y-4 pb-6 border-b border-gray-200/80">
                <Skeleton className="h-9 w-3/4 rounded-xl" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-48 rounded-md" />
                  <span className="text-gray-300">·</span>
                  <Skeleton className="h-4 w-28 rounded-md" />
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-28 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </div>

              {/* Host / Verified Card */}
              <div className="p-5 rounded-2xl border border-gray-200/80 bg-white flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-13 w-13 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-36 rounded-md" />
                    <Skeleton className="h-4 w-48 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>

              {/* Highlights Section */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-36 rounded-md" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-gray-200/70 bg-white space-y-3 shadow-xs"
                    >
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <Skeleton className="h-4 w-28 rounded-md" />
                      <Skeleton className="h-3 w-36 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Spaces / Sleeping Arrangements */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-44 rounded-md" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-gray-200/80 bg-white overflow-hidden shadow-xs"
                    >
                      <Skeleton className="w-full h-36" />
                      <div className="p-3.5 space-y-2">
                        <Skeleton className="h-4 w-24 rounded-md" />
                        <Skeleton className="h-3 w-32 rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* About Property / Description */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-32 rounded-md" />
                <div className="space-y-2.5">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-5/6 rounded-md" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                </div>
              </div>

              {/* Amenities Grid */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-32 rounded-md" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-200/70 bg-white shadow-xs"
                    >
                      <Skeleton className="h-5 w-5 rounded-md" />
                      <Skeleton className="h-4 w-28 rounded-md" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-10 w-44 rounded-xl border border-gray-300" />
              </div>

              {/* Reviews Summary */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-28 rounded-md" />
                <div className="p-6 rounded-2xl bg-white border border-gray-200/80 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-16 rounded-lg" />
                      <Skeleton className="h-4 w-28 rounded-md" />
                    </div>
                    <Skeleton className="h-4 w-32 rounded-md" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="space-y-2 p-3 rounded-xl bg-gray-50">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-7 w-7 rounded-full" />
                          <Skeleton className="h-4 w-24 rounded-md" />
                        </div>
                        <Skeleton className="h-3 w-full rounded-md" />
                        <Skeleton className="h-3 w-4/5 rounded-md" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location Map */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-32 rounded-md" />
                <div className="h-72 w-full rounded-2xl border border-gray-200/80 bg-gray-200 overflow-hidden relative shadow-xs">
                  <Skeleton className="w-full h-full" />
                </div>
              </div>
            </div>

            {/* Right Column (1 col): Sticky Booking Widget */}
            <div className="lg:col-span-1 relative">
              <div className="sticky top-[148px] z-20 rounded-3xl border border-gray-200/90 bg-white p-7 shadow-xl space-y-6">
                {/* Price per night */}
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <Skeleton className="h-8 w-32 rounded-lg" />
                    <Skeleton className="h-4 w-14 rounded-md" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>

                {/* Dual Date Box */}
                <div className="rounded-2xl border border-gray-200 overflow-hidden divide-x divide-gray-200 grid grid-cols-2 p-3.5 bg-gray-50/60">
                  <div className="space-y-1.5 pr-2">
                    <Skeleton className="h-3 w-16 rounded" />
                    <Skeleton className="h-5 w-24 rounded-md" />
                  </div>
                  <div className="space-y-1.5 pl-3">
                    <Skeleton className="h-3 w-16 rounded" />
                    <Skeleton className="h-5 w-24 rounded-md" />
                  </div>
                </div>

                {/* Guests Box */}
                <div className="rounded-2xl border border-gray-200 p-3.5 bg-gray-50/60 flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-14 rounded" />
                    <Skeleton className="h-4 w-28 rounded-md" />
                  </div>
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>

                {/* Reserve Action Button */}
                <Skeleton className="h-12 w-full rounded-xl bg-gradient-to-r from-orange-400/80 to-[#e05d00]/80 shadow-md" />

                {/* Reassurance text */}
                <Skeleton className="h-3 w-44 mx-auto rounded" />

                {/* Pricing Table Breakdown */}
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-28 rounded-md" />
                    <Skeleton className="h-4 w-16 rounded-md" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24 rounded-md" />
                    <Skeleton className="h-4 w-14 rounded-md" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="h-4 w-16 rounded-md" />
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between">
                    <Skeleton className="h-5 w-20 rounded-md" />
                    <Skeleton className="h-5 w-24 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * Modern, compact Mobile Property Skeleton
 * Matches the mobile view with:
 * - Top mobile navigation bar
 * - Hero carousel placeholder with badges & dots
 * - Compact detail cards
 * - Sleek mobile bottom pricing bar
 */
function MobilePropertySkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 1. Mobile Top Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 h-14 flex items-center justify-between">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* 2. Mobile Hero Image Carousel */}
      <div className="relative w-full h-72 sm:h-80 bg-gray-200 overflow-hidden">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-3 right-3">
          <Skeleton className="h-6 w-14 rounded-full bg-black/20 backdrop-blur-sm" />
        </div>
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          <Skeleton className="h-1.5 w-6 rounded-full bg-white/80" />
          <Skeleton className="h-1.5 w-2 rounded-full bg-white/50" />
          <Skeleton className="h-1.5 w-2 rounded-full bg-white/50" />
        </div>
      </div>

      {/* 3. Mobile Body Content */}
      <div className="p-4 space-y-5">
        {/* Title & Rating */}
        <div className="space-y-2">
          <Skeleton className="h-7 w-4/5 rounded-lg" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-32 rounded-md" />
            <span className="text-gray-300">·</span>
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
        </div>

        {/* Highlights Card */}
        <div className="p-4 rounded-2xl border border-gray-200/80 bg-white space-y-3 shadow-xs">
          <Skeleton className="h-5 w-28 rounded-md" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-3 w-40 rounded-md" />
            </div>
          </div>
        </div>

        {/* Description Card */}
        <div className="p-4 rounded-2xl border border-gray-200/80 bg-white space-y-2.5 shadow-xs">
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
        </div>

        {/* Amenities Card */}
        <div className="p-4 rounded-2xl border border-gray-200/80 bg-white space-y-3 shadow-xs">
          <Skeleton className="h-5 w-28 rounded-md" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* House Rules */}
        <div className="p-4 rounded-2xl border border-gray-200/80 bg-white space-y-2.5 shadow-xs">
          <Skeleton className="h-5 w-28 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-4/5 rounded-md" />
        </div>
      </div>

      {/* 4. Mobile Compact Sticky Bottom Pricing Bar (Matching our updated compact bar) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/80 px-3.5 py-1.5 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-baseline gap-1.5">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-3 w-12 rounded" />
            </div>
            <Skeleton className="h-3 w-28 rounded" />
          </div>
          <Skeleton className="h-8 w-36 rounded-lg bg-gradient-to-r from-orange-400 to-[#e05d00] opacity-80" />
        </div>
      </div>
    </div>
  );
}

/**
 * Universal Property Screen Skeleton Loader
 * Supports view="desktop", view="mobile", or view="responsive" (default)
 */
export default function VillaScreenSkeleton({ view = "responsive" }) {
  if (view === "desktop") {
    return (
      <div className="hidden md:block">
        <DesktopPropertySkeleton />
      </div>
    );
  }

  if (view === "mobile") {
    return (
      <div className="md:hidden">
        <MobilePropertySkeleton />
      </div>
    );
  }

  // Default responsive mode: Mobile on <md, Desktop on >=md
  return (
    <>
      <div className="md:hidden">
        <MobilePropertySkeleton />
      </div>
      <div className="hidden md:block">
        <DesktopPropertySkeleton />
      </div>
    </>
  );
}

export { DesktopPropertySkeleton, MobilePropertySkeleton };
