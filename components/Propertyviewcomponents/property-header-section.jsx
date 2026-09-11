"use client";

import {
  FaStar,
  FaUsers,
  FaHome,
  FaMapMarkerAlt,
  FaAward,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useVilla } from "@/lib/context/VillaContext";
import CustomAmenityIcon from "@/components/ui/CustomAmenityIcon";

export default function PropertyHeaderSection() {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const villa = useVilla();

  const allAmenities = villa?.amenities || [];
  const displayedAmenities = showAllAmenities
    ? allAmenities
    : allAmenities.slice(0, 5);
  const remainingCount = Math.max(0, (allAmenities.length || 0) - 5);

  return (
    <div id="overview" className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-150 shadow-xs relative">
      {/* Property Title & Location */}
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2.5 tracking-tight">
          {villa?.name} {villa?.address?.addressLine ? `- ${villa.address.addressLine}` : ""}
        </h1>
        <div className="flex items-center gap-2 text-gray-600">
          <FaMapMarkerAlt className="w-4 h-4 text-[#ff6900] flex-shrink-0" />
          <span className="text-sm font-medium text-gray-700">
            {villa?.address?.area ? `${villa.address.area}, ` : ""}{villa?.address?.city || "Destination"}
          </span>
        </div>
      </div>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <Badge
          variant="secondary"
          className="bg-amber-50/80 text-amber-900 border border-amber-200/70 px-3.5 py-1.5 rounded-full font-semibold shadow-xs"
        >
          <FaAward className="w-4 h-4 mr-1.5 text-amber-600" />
          Like a 5⭐ Hotel
        </Badge>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1 rounded-full border border-neutral-200/80">
            <FaStar className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-base text-gray-900">
              {villa?.averageRating || "4.8"}
            </span>
            <span className="text-gray-400 text-xs">/5</span>
          </div>
          <Button
            variant="link"
            className="text-gray-700 hover:text-[#ff6900] p-0 h-auto font-medium text-sm transition-colors underline-offset-4 hover:underline"
          >
            {villa?.totalReviews || 0} Verified Reviews
          </Button>
        </div>
      </div>

      {/* Property Details Badges */}
      <div className="flex flex-wrap items-center gap-2.5 mb-6">
        <Badge
          variant="secondary"
          className="bg-neutral-100/90 text-gray-800 border border-neutral-200/60 px-4 py-2 rounded-full font-medium"
        >
          <FaUsers className="w-3.5 h-3.5 mr-2 text-[#ff6900]" />
          Up to {villa?.maxCapacity || 10} Guests
        </Badge>
        {villa?.bhkType && (
          <Badge
            variant="secondary"
            className="bg-neutral-100/90 text-gray-800 border border-neutral-200/60 px-4 py-2 rounded-full font-medium"
          >
            <FaHome className="w-3.5 h-3.5 mr-2 text-[#ff6900]" />
            {villa.bhkType}
          </Badge>
        )}
        {villa?.topamenities?.slice(0, 3).map((amenity, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="bg-neutral-100/90 text-gray-800 border border-neutral-200/60 px-4 py-2 rounded-full font-medium"
          >
            <CustomAmenityIcon name={amenity} className="w-3.5 h-3.5 mr-2 text-[#ff6900]" />
            {amenity}
          </Badge>
        ))}
      </div>

      {/* Premium Amenities Preview */}
      <div className="flex flex-wrap items-center gap-2.5 w-full pt-4 border-t border-neutral-100">
        {displayedAmenities.map((amenity, index) => (
          <Badge
            key={index}
            variant="outline"
            className="bg-neutral-50 border border-neutral-200/80 text-gray-800 px-3.5 py-2 rounded-xl hover:border-orange-200 hover:bg-orange-50/40 transition-all font-normal text-xs"
          >
            <CustomAmenityIcon name={amenity} className="w-3.5 h-3.5 mr-2 text-[#ff6900]" />
            {amenity}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <Button
            variant="link"
            className="text-[#ff6900] hover:text-[#e05d00] p-0 h-auto font-semibold text-sm transition-colors ml-2"
            onClick={() => setShowAllAmenities(!showAllAmenities)}
          >
            {showAllAmenities
              ? "Show Less"
              : `+${remainingCount} More Amenities`}
          </Button>
        )}
      </div>
    </div>
  );
}
