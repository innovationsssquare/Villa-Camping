"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export function BookingSearchBox() {
  const {
    selectedCategoryName,
    checkin,
    checkout,
    selectedGuest,
  } = useSelector((state) => state.booking);

  const router = useRouter();

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const totalGuests = (selectedGuest?.adults || 1) + (selectedGuest?.childrenn || 0);

  const subtitleParts = [
    selectedCategoryName || "Anywhere",
    checkin && checkout ? `${formatDate(checkin)} – ${formatDate(checkout)}` : "Any week",
    totalGuests > 1 ? `${totalGuests} guests` : "Add guests",
  ];

  return (
    <div
      onClick={() => router.push("/search-stay")}
      className="w-full bg-white rounded-full border border-neutral-200/90 shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer px-2.5 py-1 h-10 flex items-center justify-between"
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
          <Search className="w-3 h-3" />
        </div>

        <div className="min-w-0 flex items-center gap-1.5 overflow-hidden">
          <span className="text-[11px] font-bold text-neutral-900 shrink-0">
            Where to?
          </span>
          <span className="text-neutral-300 text-[10px]">•</span>
          <span className="text-[10px] text-neutral-500 font-medium truncate">
            {subtitleParts.join(" • ")}
          </span>
        </div>
      </div>

      <div className="w-6 h-6 rounded-full border border-neutral-200/80 flex items-center justify-center text-neutral-600 shrink-0">
        <SlidersHorizontal className="w-2.5 h-2.5" />
      </div>
    </div>
  );
}
