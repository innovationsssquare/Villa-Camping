import React from "react";
import { cn } from "@/lib/utils";
import { Calendar, Sparkles } from "lucide-react";

export function HolidayCard({
  type,
  dateRange,
  name,
  totalDays,
  isSelected,
  onClick,
  className,
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-shrink-0 flex flex-col justify-between text-left p-3.5 rounded-xl border transition-all duration-200 select-none",
        "w-[180px] min-h-[90px] cursor-pointer relative overflow-hidden",
        isSelected
          ? "border-orange-500 bg-orange-50/70 shadow-sm ring-2 ring-orange-400"
          : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between w-full mb-1">
        <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
          <Sparkles className="w-2.5 h-2.5" />
          {totalDays ? `${totalDays} Days` : type || "Long Wknd"}
        </span>
      </div>

      <div className="mt-1">
        <div className="font-bold text-gray-900 text-xs line-clamp-1 leading-snug">
          {name || "Long Weekend"}
        </div>
        <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-500 font-medium">
          <Calendar className="w-3 h-3 text-orange-500 flex-shrink-0" />
          <span className="truncate">{dateRange}</span>
        </div>
      </div>
    </button>
  );
}
