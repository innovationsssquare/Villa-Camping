"use client"

import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"


export function GuestSelector({
  adults,
  childrenn,
  infants,
  pets,
  onGuestChange,
  isMobile = false,
}) {
  const GuestRow = ({
    title,
    description,
    count,
    type,
    min = 0,
    max = 16,
  }) => (
    <div className={`flex items-center justify-between ${isMobile ? "py-3" : "py-3 md:py-4"}`}>
      <div className="flex-1">
        <div className={`font-medium text-gray-900 ${isMobile ? "text-sm" : "text-sm md:text-base"}`}>{title}</div>
        <div className={`text-gray-500 ${isMobile ? "text-xs" : "text-xs md:text-sm"}`}>{description}</div>
      </div>
      <div className="flex items-center space-x-2 md:space-x-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onGuestChange(type, Math.max(min, count - 1))}
          disabled={count <= min}
          className={`rounded-full border-gray-300 hover:border-red-500 disabled:opacity-30 ${
            isMobile ? "w-7 h-7" : "w-7 h-7 md:w-8 md:h-8"
          }`}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className={`text-center font-medium ${isMobile ? "w-6 text-sm" : "w-6 md:w-8 text-sm md:text-base"}`}>
          {count}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onGuestChange(type, Math.min(max, count + 1))}
          disabled={count >= max}
          className={`rounded-full border-gray-300 hover:border-red-500 disabled:opacity-30 ${
            isMobile ? "w-7 h-7" : "w-7 h-7 md:w-8 md:h-8"
          }`}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="relative animate-fade-in">
      {/* Tooltip Arrow - Responsive sizing and positioning */}
      <div
        className={`absolute -top-1.5 md:-top-2 bg-white border-l border-t border-gray-200 rotate-45 z-10 ${
          isMobile
            ? "w-3 h-3 left-3/4 transform -translate-x-1/2"
            : "w-3 h-3 md:w-4 md:h-4 left-1/2 transform -translate-x-1/2"
        }`}
      ></div>

      <div
        className={`bg-white border border-gray-200 rounded-2xl shadow-lg relative z-20 ${
          isMobile ? "p-4 w-72" : "p-4 md:p-6 w-72 md:w-80"
        }`}
      >
        <GuestRow title="Adults" description="Ages 13 or above" count={adults} type="adults" min={1} />
        <div className="border-t border-gray-200">
          <GuestRow title="Children" description="Ages 2-12" count={childrenn} type="childrenn" />
        </div>
        <div className="border-t border-gray-200">
          <GuestRow title="Infants" description="Under 2" count={infants} type="infants" max={5} />
        </div>
        <div className="border-t border-gray-200">
          <GuestRow title="Pets" description="Bringing a service animal?" count={pets} type="pets" max={5} />
        </div>
      </div>
    </div>
  )
}
