"use client";

import { Skeleton } from "@heroui/react";

export default function PropertyCardSkeletonnew() {
  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden flex flex-col md:flex-row animate-pulse">
      {/* 1. Image Skeleton (Desktop: ~38% | Mobile: Full Width) */}
      <div className="relative w-full md:w-[38%] lg:w-[36%] h-64 sm:h-72 md:h-auto min-h-[260px] md:min-h-[290px] bg-neutral-200/60 shrink-0">
        <Skeleton className="w-full h-full" />

        {/* Top badges placeholder */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        <div className="absolute top-3 right-3 flex gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <div className="absolute bottom-3 left-3">
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
      </div>

      {/* 2. Middle Content Skeleton */}
      <div className="flex-1 p-5 lg:p-6 flex flex-col justify-between min-w-0">
        <div>
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </div>
            <Skeleton className="h-7 w-16 rounded-xl shrink-0" />
          </div>

          {/* Specs / Capacity Chips */}
          <div className="flex flex-wrap gap-2 my-4">
            <Skeleton className="h-7 w-28 rounded-lg" />
            <Skeleton className="h-7 w-20 rounded-lg" />
            <Skeleton className="h-7 w-24 rounded-lg" />
          </div>

          {/* Great for tags */}
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>

          {/* Amenities Strip */}
          <div className="pt-3 border-t border-neutral-150 flex gap-4">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
        </div>
      </div>

      {/* 3. Right Price Column Skeleton */}
      <div className="w-full md:w-[26%] lg:w-[24%] p-5 lg:p-6 bg-neutral-50/70 md:border-l border-t md:border-t-0 border-neutral-200/80 flex flex-col justify-between shrink-0 space-y-4">
        <div className="space-y-2 text-right">
          <Skeleton className="h-4 w-20 rounded-md ml-auto" />
          <Skeleton className="h-8 w-32 rounded-lg ml-auto" />
          <Skeleton className="h-3 w-28 rounded-md ml-auto" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-3 w-32 rounded-md mx-auto" />
        </div>
      </div>
    </div>
  );
}