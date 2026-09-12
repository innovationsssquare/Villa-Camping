"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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
  X,
} from "lucide-react";
import Image from "next/image";
import CustomAmenityIcon from "@/components/ui/CustomAmenityIcon";

export default function TentDetailsDrawer({
  isOpen,
  open,
  onClose,
  onOpenChange,
  tent,
  onSelectTent,
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const isDrawerOpen = isOpen !== undefined ? isOpen : Boolean(open);
  const handleClose = () => {
    if (onClose) onClose();
    if (onOpenChange) onOpenChange(false);
  };

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
    <Drawer open={isDrawerOpen} onOpenChange={(op) => !op && handleClose()} shouldScaleBackground={false}>
      <DrawerContent className="max-h-[90vh] p-0 rounded-t-3xl bg-white border-t border-gray-100 z-[160]">
        {/* Handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3" />

        {/* Header */}
        <div className="px-5 pb-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#ff6900] uppercase tracking-wider">
              <Tent className="w-3 h-3" />
              <span>Tent Unit</span>
            </div>
            <DrawerTitle className="text-xl font-bold text-gray-900">
              {tent.tentType}
            </DrawerTitle>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scroll Area */}
        <ScrollArea data-vaul-no-drag className="max-h-[calc(88vh-140px)] px-5 py-4">
          <div className="space-y-5 pr-2">
          {/* Photo Gallery */}
          <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
            <Image
              src={images[activeImageIndex] || "/placeholder.svg"}
              alt={tent.tentType}
              fill
              className="object-cover"
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
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur"
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white text-[10px] font-medium">
                  {activeImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-100/60 flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#ff6900] flex-shrink-0" />
              <div>
                <div className="text-[10px] text-gray-500">Max Guests</div>
                <div className="font-bold text-gray-900">Up to {tent.maxCapacity || 2} Guests</div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2.5">
              <Tent className="w-4 h-4 text-gray-700 flex-shrink-0" />
              <div>
                <div className="text-[10px] text-gray-500">Available</div>
                <div className="font-bold text-gray-900">{tent.totaltents || 1} Units</div>
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-500 text-[11px]">Nightly Price</span>
              <div className="font-bold text-lg text-gray-900 mt-0.5">
                {formatRupee(weekdayPrice)}
                <span className="text-xs font-normal text-gray-500"> / night</span>
              </div>
            </div>
            {weekendPrice !== weekdayPrice && (
              <div className="text-right">
                <span className="text-gray-500 text-[10px]">Weekend</span>
                <div className="font-bold text-gray-800 text-sm">
                  {formatRupee(weekendPrice)}
                </div>
              </div>
            )}
          </div>

          {/* Tent Amenities */}
          {tent.amenities && tent.amenities.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
                <span>Amenities in this tent</span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {tent.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-gray-50 border border-gray-100 flex items-center gap-2 text-[11px] font-medium text-gray-700"
                  >
                    <CustomAmenityIcon name={amenity} className="w-3.5 h-3.5 text-[#ff6900]" />
                    <span className="truncate">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {tent.description && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-gray-900">Tent Details</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {tent.description}
              </p>
            </div>
          )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1 rounded-xl text-xs font-semibold h-11 border-gray-200"
          >
            Close
          </Button>
          {onSelectTent && (
            <Button
              type="button"
              onClick={() => {
                onSelectTent(tent);
                handleClose();
              }}
              className="flex-1 rounded-xl bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs font-semibold h-11 shadow-md cursor-pointer"
            >
              Select Tent
            </Button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
