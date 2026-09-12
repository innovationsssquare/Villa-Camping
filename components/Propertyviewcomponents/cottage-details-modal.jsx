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
  Trees,
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

export default function CottageDetailsModal({
  isOpen,
  onClose,
  cottage,
  onSelectCottage,
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!cottage) return null;

  const title = cottage.cottageType || cottage.name || "Cottage Unit";
  const images =
    cottage.cottageimages && cottage.cottageimages.length > 0
      ? cottage.cottageimages
      : cottage.images && cottage.images.length > 0
      ? cottage.images
      : cottage.tentimages && cottage.tentimages.length > 0
      ? cottage.tentimages
      : ["/placeholder.svg"];

  const formatRupee = (amount) =>
    `₹${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount || 0)}`;

  const weekdayPrice = cottage.pricing?.weekdayPrice || 0;
  const weekendPrice = cottage.pricing?.weekendPrice || weekdayPrice;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl lg:max-w-3xl w-[94vw] sm:w-[90vw] md:w-full max-h-[85vh] sm:max-h-[88vh] flex flex-col gap-0 p-0 overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-gray-100 shadow-2xl z-[150] my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-orange-50/50 via-white to-amber-50/40 flex items-start justify-between relative flex-shrink-0">
          <div className="pr-8">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ff6900] text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-1.5">
              <Trees className="w-3.5 h-3.5" />
              <span>Cottage Unit Details</span>
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {title}
            </DialogTitle>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 sm:line-clamp-none">
              Serene cottage stay surrounded by nature with private amenities and comfort.
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
              alt={title}
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
                <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs text-white font-medium">
                  {activeImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 rounded-xl bg-orange-50/60 border border-orange-100 flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center flex-shrink-0">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                  Capacity
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-900 truncate block">
                  Up to {cottage.maxCapacity || 2} Guests
                </span>
              </div>
            </div>

            <div className="p-2 sm:p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                <Trees className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                  Total Units
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-900 truncate block">
                  {cottage.totalcottage || cottage.totalCottages || cottage.totaltents || 1} Available
                </span>
              </div>
            </div>

            <div className="p-2 sm:p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                  Hygiene
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-900 truncate block">
                  Sanitized
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Info Card */}
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-200/80 bg-neutral-50/60 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                Seasonal Rates
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-base sm:text-lg font-bold text-gray-900">
                  {formatRupee(weekdayPrice)}
                </span>
                <span className="text-[11px] sm:text-xs text-gray-500 font-normal">
                  weekday
                </span>
                {weekendPrice > weekdayPrice && (
                  <>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">
                      {formatRupee(weekendPrice)}
                    </span>
                    <span className="text-[11px] sm:text-xs text-gray-500 font-normal">
                      weekend
                    </span>
                  </>
                )}
              </div>
            </div>
            <span className="text-[11px] text-gray-400 font-medium">
              * Per night + applicable taxes
            </span>
          </div>

          {/* Description */}
          {cottage.description && (
            <div className="space-y-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
                About this Cottage
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {cottage.description}
              </p>
            </div>
          )}

          {/* Amenities & Inclusions */}
          {cottage.amenities && cottage.amenities.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6900]" />
                Included Amenities
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {cottage.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white border border-gray-100 shadow-2xs text-xs text-gray-700"
                  >
                    <div className="w-6 h-6 rounded-md bg-orange-50 text-[#ff6900] flex items-center justify-center flex-shrink-0">
                      <CustomAmenityIcon name={amenity} className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-100 bg-gray-50/80 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-gray-200 text-xs sm:text-sm h-9 sm:h-10 w-full sm:w-auto"
          >
            Close
          </Button>

          {onSelectCottage && (
            <Button
              onClick={() => {
                onSelectCottage(cottage);
                onClose();
              }}
              className="rounded-xl bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c84d00] text-white text-xs sm:text-sm font-bold px-6 shadow-md shadow-orange-500/20 h-9 sm:h-10 w-full sm:w-auto"
            >
              Select this Cottage
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
