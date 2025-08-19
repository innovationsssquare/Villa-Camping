"use client"

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
} from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export default function PropertyHeaderSection() {
  const [showAllAmenities, setShowAllAmenities] = useState(false)

  const allAmenities = [
    { icon: FaMountain, label: "Mountain View" },
    { icon: FaUtensils, label: "Breakfast Included" },
    { icon: FaWifi, label: "WiFi", hasIndicator: true },
    { icon: FaHotTub, label: "Jacuzzi", hasIndicator: true },
    { icon: FaFire, label: "BBQ Grill", hasIndicator: true },
    { icon: FaCar, label: "Free Parking" },
    { icon: FaTv, label: "Smart TV" },
    { icon: FaSnowflake, label: "Air Conditioning" },
    { icon: FaCoffee, label: "Coffee Machine" },
    { icon: FaGamepad, label: "Game Room" },
    { icon: FaCamera, label: "Security Cameras" },
    { icon: FaMusic, label: "Sound System" },
    { icon: FaDumbbell, label: "Fitness Center" },
    { icon: FaTree, label: "Garden View" },
    { icon: FaSun, label: "Terrace" },
    { icon: FaSnowflake, label: "Heating" },
    { icon: FaShieldAlt, label: "Safe" },
    { icon: FaClock, label: "24/7 Support" },
    { icon: FaPhone, label: "Phone" },
    { icon: FaTshirt, label: "Laundry Service" },
    { icon: FaUtensils, label: "Kitchen" },
    { icon: FaBed, label: "Premium Bedding" },
    { icon: FaCouch, label: "Living Area" },
    { icon: FaBlender, label: "Refrigerator" },
    { icon: FaMicrochip, label: "Microwave" },
  ]

  const displayedAmenities = showAllAmenities ? allAmenities : allAmenities.slice(0, 5)
  const remainingCount = allAmenities.length - 5

  return (
    <div id="overview" className="bg-white min-h-[400px] relative">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="flex-1">
            {/* Property Title & Location */}
            <div className="mb-6">
              <h1 className="text-3xl lg:text-3xl font-bold text-gray-900 mb-3 tracking-tight drop-shadow-lg">
                Vastalya Villa - Malawali
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <FaMapMarkerAlt className="w-5 h-5 text-black" />
                <span className="text-sm font-medium drop-shadow">Malawali, Lonavala</span>
              </div>
            </div>

            {/* Rating & Reviews */}
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
                  <span className="font-bold text-lg text-black drop-shadow">4.8</span>
                  <span className="text-black/80">/5</span>
                </div>
                <Button variant="link" className="text-black hover:text-white/80 p-0 h-auto font-medium drop-shadow">
                  65 Reviews
                </Button>
              </div>
            </div>

            {/* Property Details Grid */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Badge variant="secondary" className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full">
                <FaUsers className="w-4 h-4 mr-2 text-black" />
                Up to 15 Guests
              </Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full">
                <FaHome className="w-4 h-4 mr-2 text-black" />5 Rooms
                <FaInfoCircle className="w-4 h-4 ml-2 text-black" />
              </Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full">
                <FaBath className="w-4 h-4 mr-2 text-black" />5 Baths
              </Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full">
                <FaUtensils className="w-4 h-4 mr-2 text-black" />
                Meals Available
              </Badge>
            </div>

            {/* Great For Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium text-gray-900">Great for:</span>
                <div className="flex items-center gap-2">
                  <FaMountain className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800 font-medium">Mountain Retreat</span>
                </div>
              </div>
            </div>

            {/* Premium Amenities */}
            <div className="flex flex-wrap items-center gap-3 w-full">
              {displayedAmenities.map((amenity, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-gray-200 border-white text-black px-3 py-2 rounded-md hover:bg-gray-300"
                >
                  <amenity.icon className="w-4 h-4 mr-2 text-black" />
                  {amenity.label}
                  {amenity.hasIndicator && <span className="ml-1 w-2 h-2 bg-green-500 rounded-full"></span>}
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
                  <Badge variant="destructive" className="ml-2 text-xs bg-black border-0">
                    Save 10%
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gray-900">₹52,975</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">(for 5 rooms) Per Night + Taxes</p>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Base price (5 rooms)</span>
                    <span>₹47,250</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>₹3,150</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cleaning fee</span>
                    <span>₹2,575</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span>Total per night</span>
                    <span>₹52,975</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
