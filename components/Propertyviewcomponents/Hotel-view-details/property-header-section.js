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
import { useHotel } from "@/lib/context/HotelContext";
import CustomAmenityIcon from "@/components/ui/CustomAmenityIcon";

export default function PropertyHeaderSection() {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const hotel = useHotel();
  const basePrice =
    Number(hotel?.basePricePerNight) ||
    Number(hotel?.pricing?.weekdayPrice) ||
    Number(hotel?.pricing?.weekendPrice) ||
    0;
  const taxes = Math.round(basePrice * 0.18);
  const totalPerNight = basePrice + taxes;

  const allAmenities = hotel?.amenities || [];

  const displayedAmenities = showAllAmenities
    ? allAmenities
    : allAmenities.slice(0, 5);

  const remainingCount = Math.max(0, (allAmenities.length || 0) - 5);

  return (
    <div id="overview" className="bg-white min-h-[400px] relative">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl lg:text-3xl font-bold text-gray-900 mb-3 tracking-tight drop-shadow-lg">
                {hotel?.name} - {hotel?.address?.addressLine}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <FaMapMarkerAlt className="w-5 h-5 text-black" />
                <span className="text-sm font-medium drop-shadow">
                  {hotel?.address?.area}, {hotel?.address?.city}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-8">
              <Badge
                variant="secondary"
                className="bg-white/20 backdrop-blur-sm text-black border-white/30 px-3 py-1.5"
              >
                <FaAward className="w-4 h-4 mr-1.5 text-black" />
                Like a 5⭐ Hotel
              </Badge>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <FaStar className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-lg text-black drop-shadow">
                    {hotel?.averageRating || "0"}
                  </span>
                  <span className="text-black/80">/5</span>
                </div>
                <Button
                  variant="link"
                  className="text-black hover:text-white/80 p-0 h-auto font-medium drop-shadow"
                >
                  {hotel?.totalReviews || 0} Reviews
                </Button>
              </div>
            </div>

            {/* Details Grid */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full"
              >
                <FaUsers className="w-4 h-4 mr-2 text-black" />
                Up to {hotel?.maxCapacity} Guests
              </Badge>
              {hotel?.bhkType && (
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full"
                >
                  <FaHome className="w-4 h-4 mr-2 text-black" />
                  {hotel.bhkType}
                </Badge>
              )}
              {hotel?.topamenities?.slice(0, 3).map((amenity, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full"
                >
                  <CustomAmenityIcon name={amenity} className="w-4 h-4 mr-2 text-black" />
                  {amenity}
                </Badge>
              ))}
            </div>

            {/* Premium Amenities */}
            <div className="flex flex-wrap items-center gap-3 w-full">
              {displayedAmenities.map((amenity, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-gray-200 border-white text-black px-3 py-2 rounded-md hover:bg-gray-300"
                >
                  <CustomAmenityIcon name={amenity} className="w-4 h-4 mr-2 text-black" />
                  {amenity}
                </Badge>
              ))}
              {allAmenities.length > 5 && (
                <Button
                  variant="link"
                  className="text-blue-600 hover:text-blue-800 p-0 h-auto font-medium"
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                >
                  {showAllAmenities ? "Show Less" : `+${remainingCount} Amenities`}
                </Button>
              )}
            </div>
          </div>

          <div className="lg:w-80 flex-shrink-0">
            <div className="border-white border bg-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:bg-white">
              <div className="text-center">
                <div className="mb-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gray-900">
                      ₹{basePrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Per Night + Taxes</p>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Base price </span>
                    <span>₹{basePrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cleaning fee</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span>₹{taxes.toLocaleString("en-IN")}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span>Total per night</span>
                    <span>₹{totalPerNight.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
