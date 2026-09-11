"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PropertyCard } from "./PropertyCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, MapPin, X, Filter } from "lucide-react";

export const PropertiesListDrawer = ({
  isOpen,
  onOpenChange,
  properties = [],
  location,
  totalCount = 0,
}) => {
  const [sortBy, setSortBy] = useState("price-low");
  const [selectedType, setSelectedType] = useState("all");

  const isWeekendIST = () => {
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const day = now.getDay();
    return day === 0 || day === 6;
  };

  const getEffectivePrice = (property) => {
    return isWeekendIST()
      ? property.price?.weekendPrice ?? 0
      : property.price?.weekdayPrice ?? 0;
  };

  const sortedProperties = [...properties].sort((a, b) => {
    const priceA = getEffectivePrice(a);
    const priceB = getEffectivePrice(b);

    switch (sortBy) {
      case "price-low":
        return priceA - priceB;
      case "price-high":
        return priceB - priceA;
      default:
        return 0;
    }
  });

  const filteredProperties =
    selectedType === "all"
      ? sortedProperties
      : sortedProperties.filter((property) => property.type === selectedType);

  const propertyTypes = [
    { value: "all", label: "All Types" },
    { value: "villa", label: "Villa" },
    { value: "camping", label: "Camping" },
    { value: "cottage", label: "Cottage" },
    { value: "hotel", label: "Hotel" },
  ];

  const sortOptions = [
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[92vh] sm:h-[90vh] rounded-t-3xl border-none fixed bottom-0 left-0 right-0 p-0 w-full overflow-hidden bg-neutral-50/70"
      >
        <div className="flex flex-col h-full bg-white">
          {/* Sheet Header with drag handle and close button */}
          <SheetHeader className="px-5 pt-3 pb-3 border-b border-neutral-200/90 bg-white">
            <div className="flex flex-col items-center">
              <div className="w-10 h-1 bg-neutral-300 rounded-full mb-3" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#ff6900] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <SheetTitle className="text-base font-bold text-neutral-900 leading-tight">
                    {properties.length > 0
                      ? `${totalCount} Stays in ${location || "Location"}`
                      : "No properties found"}
                  </SheetTitle>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5">
                    Explore available properties on the map
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sorting & Filter Strip */}
            {properties.length > 0 && (
              <div className="grid grid-cols-2 gap-2 pt-3 mt-1">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-neutral-50 border-neutral-200 text-xs h-9 rounded-xl font-medium">
                    <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-neutral-500" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-neutral-50 border-neutral-200 text-xs h-9 rounded-xl font-medium">
                    <Filter className="w-3.5 h-3.5 mr-1.5 text-neutral-500" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </SheetHeader>

          {/* Properties List Scroll Area */}
          <ScrollArea className="flex-1 px-4 py-4">
            {filteredProperties.length > 0 ? (
              <div className="space-y-3 pb-12">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    compact={true}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="w-12 h-12 rounded-full bg-orange-50 text-[#ff6900] flex items-center justify-center mb-3">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-neutral-900 mb-1">
                  No properties found
                </h4>
                <p className="text-xs text-neutral-500 max-w-xs">
                  Try switching categories or clearing active filters to view all available stays.
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};