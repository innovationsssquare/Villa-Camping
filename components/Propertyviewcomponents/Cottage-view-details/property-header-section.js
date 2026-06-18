"use client";

import {
  FaStar,
  FaUsers,
  FaHome,
  FaBath,
  FaUtensils,
  FaMountain,
  FaWifi,
  FaHotTub,
  FaFire,
  FaMapMarkerAlt,
  FaAward,
  FaInfoCircle,
  FaCar,
  FaTv,
  FaSnowflake,
  FaCoffee,
  FaGamepad,
  FaCamera,
  FaMusic,
  FaDumbbell,
  FaTree,
  FaSun,
  FaShieldAlt,
  FaClock,
  FaPhone,
  FaTshirt,
  FaBed,
  FaCouch,
  FaBlender,
  FaMicrochip,
  FaSwimmingPool,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useCottage } from "@/lib/context/CottageContext";
import { AirVent, Car, Mountain, Tv, Waves, Wifi } from "lucide-react";

export default function PropertyHeaderSection() {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const cottage = useCottage();
  const basePrice =
    Number(cottage?.basePricePerNight) ||
    Number(cottage?.pricing?.weekdayPrice) ||
    Number(cottage?.pricing?.weekendPrice) ||
    0;
  const taxes = Math.round(basePrice * 0.18);
  const totalPerNight = basePrice + taxes;

  const amenityIcons = {
    "Mountain View": FaMountain,
    "Breakfast Included": FaUtensils,
    WiFi: FaWifi,
    Jacuzzi: FaHotTub,
    "BBQ Grill": FaFire,
    "Free Parking": FaCar,
    "Smart TV": FaTv,
    "Air Conditioning": FaSnowflake,
    "Coffee Machine": FaCoffee,
    "Game Room": FaGamepad,
    "Security Cameras": FaCamera,
    "Sound System": FaMusic,
    "Fitness Center": FaDumbbell,
    "Garden View": FaTree,
    Terrace: FaSun,
    Heating: FaSnowflake,
    Safe: FaShieldAlt,
    "24/7 Support": FaClock,
    Phone: FaPhone,
    "Laundry Service": FaTshirt,
    Kitchen: FaUtensils,
    "Premium Bedding": FaBed,
    "Living Area": FaCouch,
    Refrigerator: FaBlender,
    Microwave: FaMicrochip,
    "Swimming Pool": FaSwimmingPool,
    Parking: FaCar,
    Garden: FaTree,
    TV: FaTv,
    Security: FaShieldAlt,
    Balcony: FaSun,
    "Washing Machine": FaTshirt,
  };

  const allAmenities = cottage?.amenities?.map((label) => ({
    label,
    icon: amenityIcons[label] || FaInfoCircle,
  }));

  const displayedAmenities = showAllAmenities
    ? allAmenities
    : allAmenities?.slice(0, 5);

  const remainingCount = (allAmenities?.length || 0) - 5;

  return (
    <div id="overview" className="bg-white min-h-[400px] relative">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl lg:text-3xl font-bold text-gray-900 mb-3 tracking-tight drop-shadow-lg">
                {cottage?.name} - {cottage?.address?.addressLine}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <FaMapMarkerAlt className="w-5 h-5 text-black" />
                <span className="text-sm font-medium drop-shadow">
                  {cottage?.address?.area}, {cottage?.address?.city}
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
                    {cottage?.averageRating}
                  </span>
                  <span className="text-black/80">/5</span>
                </div>
                <Button
                  variant="link"
                  className="text-black hover:text-white/80 p-0 h-auto font-medium drop-shadow"
                >
                  {cottage?.totalReviews} Reviews
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full"
              >
                <FaUsers className="w-4 h-4 mr-2 text-black" />
                Up to {cottage?.maxCapacity} Guests
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full"
              >
                <FaHome className="w-4 h-4 mr-2 text-black" />
                {cottage?.bhkType}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full"
              >
                <FaSwimmingPool className="w-4 h-4 mr-2 text-black" /> Pool
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full"
              >
                <FaUtensils className="w-4 h-4 mr-2 text-black" />
                Meals Available
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full">
              {displayedAmenities.map((amenity, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-gray-200 border-white text-black px-3 py-2 rounded-md hover:bg-gray-300"
                >
                  <amenity.icon className="w-4 h-4 mr-2 text-black" />
                  {amenity.label}
                  {amenity.hasIndicator && (
                    <span className="ml-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </Badge>
              ))}
              <Button
                variant="link"
                className="text-blue-600 hover:text-blue-800 p-0 h-auto font-medium"
                onClick={() => setShowAllAmenities(!showAllAmenities)}
              >
                {showAllAmenities ? "Show Less" : `+${remainingCount} Amenities`}
              </Button>
            </div>
          </div>

          <div className="lg:w-80 flex-shrink-0">
            <div className="border-white border bg-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:bg-white">
              <div className="text-center">
                <div className="mb-2">
                  <span className="text-gray-500 line-through text-lg">₹58,750</span>
                  <Badge variant="destructive" className="ml-2 text-xs bg-black border-0">Save 10%</Badge>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gray-900">₹{basePrice}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Per Night + Taxes</p>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Base price </span>
                    <span>₹{basePrice}</span>
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
                    <span>{taxes}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span>Total per night</span>
                    <span>₹{totalPerNight}</span>
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
