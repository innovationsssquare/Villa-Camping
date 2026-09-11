"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  SlidersHorizontal,
  HouseWifi,
  Tent,
  House,
  Bed,
  Check,
  RotateCcw,
} from "lucide-react";

const PROPERTY_TYPES = [
  { id: "villa", label: "Villa", icon: HouseWifi },
  { id: "camping", label: "Camping", icon: Tent },
  { id: "cottage", label: "Cottage", icon: House },
  { id: "hotel", label: "Hotel", icon: Bed },
];

const AMENITIES = [
  "Swimming Pool",
  "Garden / Lawn",
  "Free Parking",
  "Wi-Fi",
  "Power Backup",
  "AC Rooms",
  "Kitchen / Chef",
  "Pet Friendly",
  "Mountain View",
  "Caretaker",
  "BBQ Grill",
  "Music System",
];

export const FilterDrawer = ({
  isOpen,
  onOpenChange,
  side = "bottom",
  onApply,
}) => {
  const [priceRange, setPriceRange] = useState([2000, 45000]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState("any");

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearAllFilters = () => {
    setPriceRange([2000, 45000]);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setSelectedRooms("any");
  };

  const applyFilters = () => {
    onApply?.({
      priceRange,
      selectedTypes,
      selectedAmenities,
      selectedRooms,
    });
    onOpenChange(false);
  };

  function formatRupee(amount) {
    if (amount == null || Number.isNaN(Number(amount))) return "₹0";
    return `₹${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Number(amount))}`;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        className={
          side === "bottom"
            ? "h-[88vh] sm:h-[85vh] rounded-t-3xl border-none p-0 bg-white flex flex-col overflow-hidden"
            : "w-full sm:max-w-md h-full max-h-screen border-none p-0 bg-white flex flex-col overflow-hidden"
        }
      >
        <div className="flex flex-col h-full max-h-full bg-white overflow-hidden">
          {/* 1. Header (Fixed, Does Not Scroll) */}
          <SheetHeader className="px-6 py-4 border-b border-neutral-200/90 shrink-0 bg-white z-10">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-left flex items-center gap-2 text-base md:text-lg font-bold text-neutral-900">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#ff6900]">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <span>Filters</span>
              </SheetTitle>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-neutral-500 hover:text-[#ff6900] flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>
          </SheetHeader>

          {/* 2. Scrollable Filter Body (Guaranteed to Scroll in any Viewport) */}
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-6 overscroll-contain">
            {/* 1. Price Range */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-neutral-900">
                  Price Range (per night)
                </h3>
                <span className="text-xs font-bold text-[#ff6900] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  {formatRupee(priceRange[0])} - {formatRupee(priceRange[1])}
                </span>
              </div>

              <div className="px-2 py-4">
                <Slider
                  min={1000}
                  max={60000}
                  step={1000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-xs text-neutral-400 font-medium mt-2">
                  <span>₹1,000</span>
                  <span>₹30,000</span>
                  <span>₹60,000+</span>
                </div>
              </div>
            </div>

            <Separator className="bg-neutral-150" />

            {/* 2. Property Types Tiles */}
            <div>
              <h3 className="font-bold text-sm text-neutral-900 mb-3">
                Property Type
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {PROPERTY_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedTypes.includes(type.id);

                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => toggleType(type.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center gap-3 relative ${
                        isSelected
                          ? "border-[#ff6900] bg-orange-50/80 text-neutral-900 shadow-xs"
                          : "border-neutral-200/90 hover:border-neutral-300 bg-white text-neutral-700"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-[#ff6900] text-white"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <span className="font-bold text-sm flex-1 truncate">
                        {type.label}
                      </span>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#ff6900] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator className="bg-neutral-150" />

            {/* 3. Rooms / Capacity */}
            <div>
              <h3 className="font-bold text-sm text-neutral-900 mb-3">
                Bedrooms
              </h3>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {["any", "1", "2", "3", "4", "5+"].map((room) => {
                  const isSelected = selectedRooms === room;
                  return (
                    <button
                      key={room}
                      type="button"
                      onClick={() => setSelectedRooms(room)}
                      className={`h-9 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize ${
                        isSelected
                          ? "bg-[#ff6900] text-white shadow-xs"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80"
                      }`}
                    >
                      {room === "any" ? "Any" : `${room} BHK`}
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator className="bg-neutral-150" />

            {/* 4. Amenities Checklist Chips */}
            <div>
              <h3 className="font-bold text-sm text-neutral-900 mb-3">
                Popular Amenities
              </h3>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((amenity) => {
                  const isSelected = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-orange-50 border border-[#ff6900] text-[#ff6900] shadow-xs"
                          : "bg-neutral-50 border border-neutral-200/80 text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{amenity}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Sticky Viewport Footer (Always Visible at Bottom) */}
          <div className="p-4 border-t border-neutral-200/90 bg-white/98 backdrop-blur-md shrink-0 z-10">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl text-neutral-700 border-neutral-200 font-bold hover:bg-neutral-100 cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c84d00] text-white font-bold shadow-xs hover:shadow-md cursor-pointer"
                onClick={applyFilters}
              >
                Show Results
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};