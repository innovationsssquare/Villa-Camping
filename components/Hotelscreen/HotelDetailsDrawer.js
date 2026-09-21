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
import {
  Users,
  Hotel,
  Bed,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X,
} from "lucide-react";
import Image from "next/image";
import CustomAmenityIcon from "@/components/ui/CustomAmenityIcon";

export default function HotelDetailsDrawer({
  isOpen,
  open,
  onClose,
  onOpenChange,
  room,
  tent,
  onSelectRoom,
  onBookNow,
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const activeRoom = room || tent;
  const isDrawerOpen = isOpen !== undefined ? isOpen : Boolean(open);

  const handleClose = () => {
    if (onClose) onClose();
    if (onOpenChange) onOpenChange(false);
  };

  const handleSelect = () => {
    if (onSelectRoom) onSelectRoom(activeRoom);
    else if (onBookNow) onBookNow(activeRoom);
    else handleClose();
  };

  if (!activeRoom) return null;

  const images =
    activeRoom.roomimages && activeRoom.roomimages.length > 0
      ? activeRoom.roomimages
      : activeRoom.images && activeRoom.images.length > 0
      ? activeRoom.images
      : ["/placeholder.svg"];

  const formatRupee = (amount) =>
    `₹${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount || 0)}`;

  const weekdayPrice =
    activeRoom.pricing?.weekdayPrice || activeRoom.price || 0;
  const weekendPrice =
    activeRoom.pricing?.weekendPrice || weekdayPrice;
  const totalUnits =
    activeRoom.totalRooms ||
    activeRoom.totaltents ||
    1;

  return (
    <Drawer
      open={isDrawerOpen}
      onOpenChange={(op) => !op && handleClose()}
      shouldScaleBackground={false}
    >
      <DrawerContent className="max-h-[90vh] p-0 rounded-t-3xl bg-white border-t border-gray-100">
        {/* Handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3" />

        {/* Header */}
        <div className="px-5 pb-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#ff6900] uppercase tracking-wider">
              <Hotel className="w-3 h-3" />
              <span>Room / Suite</span>
            </div>
            <DrawerTitle className="text-xl font-bold text-gray-900">
              {activeRoom.roomType || activeRoom.name || "Room"}
            </DrawerTitle>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800"
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
              alt={activeRoom.roomType || "Room"}
              fill
              unoptimized
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
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur cursor-pointer"
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-white">
                  {activeImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150 flex flex-col items-center text-center">
              <Users className="w-4 h-4 text-[#ff6900] mb-1" />
              <span className="text-[10px] text-gray-500 font-medium">Capacity</span>
              <span className="text-xs font-bold text-gray-900">
                Up to {activeRoom.maxCapacity || 2} Guests
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150 flex flex-col items-center text-center">
              <Bed className="w-4 h-4 text-[#ff6900] mb-1" />
              <span className="text-[10px] text-gray-500 font-medium">Bed Setup</span>
              <span className="text-xs font-bold text-gray-900 truncate w-full">
                {activeRoom.bedType || "King / Queen"}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150 flex flex-col items-center text-center">
              <ShieldCheck className="w-4 h-4 text-[#ff6900] mb-1" />
              <span className="text-[10px] text-gray-500 font-medium">Inventory</span>
              <span className="text-xs font-bold text-emerald-600">
                {totalUnits} Available
              </span>
            </div>
          </div>

          {/* Description */}
          {activeRoom.description && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                About this Room
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {activeRoom.description}
              </p>
            </div>
          )}

          {/* Amenities */}
          {activeRoom.amenities && activeRoom.amenities.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Room Amenities
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {activeRoom.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 border border-neutral-150"
                  >
                    <CustomAmenityIcon name={amenity} className="w-3.5 h-3.5 text-[#ff6900]" />
                    <span className="text-xs text-gray-700 font-medium truncate">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between">
          <div>
            <div className="text-lg font-black text-gray-900">
              {formatRupee(weekdayPrice)}
            </div>
            <div className="text-[10px] text-gray-500">Per night + taxes</div>
          </div>
          <Button
            type="button"
            onClick={handleSelect}
            className="bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c84d00] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
          >
            Select Room
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
