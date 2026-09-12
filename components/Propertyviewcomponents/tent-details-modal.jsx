"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Tent,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  CheckCircle2,
  Compass,
} from "lucide-react";
import Image from "next/image";
import CustomAmenityIcon from "@/components/ui/CustomAmenityIcon";

export default function TentDetailsModal({
  isOpen,
  onClose,
  tent,
  onSelectTent,
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!tent) return null;

  const images =
    tent.tentimages && tent.tentimages.length > 0
      ? tent.tentimages
      : tent.images && tent.images.length > 0
      ? tent.images
      : ["/placeholder.svg"];

  const formatRupee = (amount) =>
    `₹${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount || 0)}`;

  const weekdayPrice = tent.pricing?.weekdayPrice || 0;
  const weekendPrice = tent.pricing?.weekendPrice || weekdayPrice;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl lg:max-w-3xl w-[94vw] sm:w-[90vw] md:w-full max-h-[85vh] sm:max-h-[88vh] flex flex-col gap-0 p-0 overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-gray-100 shadow-2xl z-[150] my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-orange-50/50 via-white to-amber-50/40 flex items-start justify-between relative flex-shrink-0">
          <div className="pr-8">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ff6900] text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-1.5">
              <Tent className="w-3.5 h-3.5" />
              <span>Tent Unit Details</span>
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {tent.tentType}
            </DialogTitle>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 sm:line-clamp-none">
              Campsite accommodation with private scenic views and modern amenities.
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            {/* Photo Showcase */}
          <div className="relative w-full h-44 sm:h-56 md:h-64 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 group flex-shrink-0">
            <Image
              src={images[activeImageIndex] || "/placeholder.svg"}
              alt={tent.tentType}
              fill
              className="object-cover transition-all duration-300 select-none"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur transition-all active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur transition-all active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-white text-[10px] sm:text-[11px] font-medium">
                  {activeImageIndex + 1} / {images.length} Photos
                </div>
              </>
            )}
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-14 h-11 sm:w-16 sm:h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    idx === activeImageIndex
                      ? "border-[#ff6900] scale-105 shadow-xs"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Key Specs Row */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="p-2.5 sm:p-3.5 rounded-xl bg-orange-50/40 border border-orange-100 flex flex-col items-center text-center">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff6900] mb-0.5 sm:mb-1" />
              <span className="text-[10px] sm:text-xs text-gray-500 font-medium">Max Capacity</span>
              <span className="font-bold text-gray-900 text-xs sm:text-sm truncate w-full">
                Up to {tent.maxCapacity || 2} Guests
              </span>
            </div>
            <div className="p-2.5 sm:p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center">
              <Tent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700 mb-0.5 sm:mb-1" />
              <span className="text-[10px] sm:text-xs text-gray-500 font-medium">Total Units</span>
              <span className="font-bold text-gray-900 text-xs sm:text-sm truncate w-full">
                {tent.totaltents || 1} Available
              </span>
            </div>
            <div className="p-2.5 sm:p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100 flex flex-col items-center text-center">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 mb-0.5 sm:mb-1" />
              <span className="text-[10px] sm:text-xs text-gray-500 font-medium">Cleanliness</span>
              <span className="font-bold text-gray-900 text-xs sm:text-sm truncate w-full">
                Sanitized & Fresh
              </span>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="p-3 sm:p-4 rounded-xl border border-gray-200/80 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Nightly Tariff
              </span>
              <div className="flex items-baseline gap-1.5 sm:gap-2 mt-0.5">
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  {formatRupee(weekdayPrice)}
                </span>
                <span className="text-[11px] sm:text-xs text-gray-500">/ tent / weekday</span>
              </div>
            </div>
            {weekendPrice !== weekdayPrice && (
              <div className="sm:text-right border-t sm:border-t-0 pt-1.5 sm:pt-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                <span className="text-[10px] sm:text-xs text-gray-500">Weekend Rate</span>
                <div className="text-base sm:text-lg font-bold text-gray-800">
                  {formatRupee(weekendPrice)}
                </div>
              </div>
            )}
          </div>

          {/* Tent Amenities */}
          {tent.amenities && tent.amenities.length > 0 && (
            <div className="space-y-2.5 sm:space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff6900]" />
                <span>Included Tent Amenities</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                {tent.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="p-2 sm:p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 flex items-center gap-2 text-xs font-medium text-gray-700"
                  >
                    <CustomAmenityIcon
                      name={amenity}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff6900] flex-shrink-0"
                    />
                    <span className="truncate">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {tent.description && (
            <div className="space-y-1.5 sm:space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">About this Tent</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {tent.description}
              </p>
            </div>
          )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4 flex-shrink-0">
          <div className="text-[11px] sm:text-xs text-gray-500 text-center sm:text-left">
            Check-in: 2:00 PM • Check-out: 11:00 AM
          </div>
          <div className="flex items-center gap-2.5 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-gray-200 text-xs font-semibold px-4 h-9 flex-1 sm:flex-initial"
            >
              Close
            </Button>
            {onSelectTent && (
              <Button
                type="button"
                onClick={() => {
                  onSelectTent(tent);
                  onClose();
                }}
                className="rounded-xl bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c55000] text-white text-xs font-semibold px-5 h-9 shadow-md cursor-pointer flex-1 sm:flex-initial"
              >
                Select This Tent
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
