import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Bed, Bath, Star } from "lucide-react";
import { getDisplayPrice } from "./getDisplayPrice";

export const PropertyHoverCard = ({ property, position }) => {
  const displayPrice = getDisplayPrice(property.price);

  function formatRupee(amount) {
    if (amount == null || Number.isNaN(Number(amount))) return "₹0";
    return `₹${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Number(amount))}`;
  }

  const imageUrl =
    property.images?.[0] || property.image || "/placeholder.svg";

  return (
    <div
      className="fixed z-50 pointer-events-none transition-transform duration-75 ease-out"
      style={{
        left: position.x + 12,
        top: position.y - 120,
        transform:
          position.x > (typeof window !== "undefined" ? window.innerWidth / 2 : 500)
            ? "translateX(-105%)"
            : "none",
      }}
    >
      <Card className="w-64 bg-white/98 backdrop-blur-md p-0 shadow-[0_20px_45px_rgba(0,0,0,0.18)] rounded-2xl overflow-hidden border border-neutral-200/90 animate-in fade-in zoom-in-95 duration-150">
        <CardContent className="p-0">
          {/* Cover Image */}
          <div className="relative w-full h-36 bg-neutral-100 overflow-hidden">
            <img
              src={imageUrl}
              alt={property.title || "Stay"}
              className="w-full h-full object-cover"
            />

            {/* Category Tag */}
            <div className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-black/5 shadow-xs">
              <span className="text-[10px] font-bold text-[#ff6900] capitalize">
                {property.type || property.category || "Stay"}
              </span>
            </div>

            {/* Rating Tag */}
            <div className="absolute top-2.5 right-2.5 z-10 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full border border-black/5 shadow-xs flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-bold text-neutral-900">
                {property.rating?.average || "4.8"}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="p-3.5">
            <h4 className="font-bold text-sm text-neutral-900 truncate mb-1">
              {property.title}
            </h4>

            <div className="flex items-center text-xs text-neutral-500 mb-2.5">
              <MapPin className="w-3 h-3 mr-1 text-[#ff6900] shrink-0" />
              <span className="truncate">{property.location}</span>
            </div>

            {/* Specs row */}
            <div className="flex items-center gap-3 text-[11px] text-neutral-600 pb-2.5 mb-2.5 border-b border-neutral-150/80">
              {property.maxCapacity && (
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-neutral-400" />
                  <span>{property.maxCapacity} Guests</span>
                </div>
              )}
              {property.rooms != null && (
                <div className="flex items-center gap-1">
                  <Bed className="w-3 h-3 text-neutral-400" />
                  <span>{property.rooms} Beds</span>
                </div>
              )}
              {property.baths != null && (
                <div className="flex items-center gap-1">
                  <Bath className="w-3 h-3 text-neutral-400" />
                  <span>{property.baths} Baths</span>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider block">
                  Starts from
                </span>
                <span className="text-base font-black text-neutral-900">
                  {formatRupee(displayPrice)}
                </span>
                <span className="text-[10px] text-neutral-400 font-medium ml-1">
                  / night
                </span>
              </div>

              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Available
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

