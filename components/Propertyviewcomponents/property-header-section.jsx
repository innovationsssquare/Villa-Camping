"use client"

import {
  Star,
  Users,
  Home,
  Bath,
  ChefHat,
  Mountain,
  Utensils,
  Wifi,
  Waves,
  Flame,
  MapPin,
  Award,
  Info,
  FileText,
  Car,
  Tv,
  Wind,
  Coffee,
  Gamepad2,
  Camera,
  Music,
  Dumbbell,
  TreePine,
  Sun,
  Snowflake,
  Shield,
  Clock,
  Phone,
  Shirt,
  MenuIcon as Restaurant,
  Bed,
  Sofa,
  Refrigerator,
  Microwave,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export default function PropertyHeaderSection() {
  const [showAllAmenities, setShowAllAmenities] = useState(false)

  const allAmenities = [
    { icon: Mountain, label: "Mountain View" },
    { icon: Utensils, label: "Breakfast Included" },
    { icon: Wifi, label: "WiFi", hasIndicator: true },
    { icon: Waves, label: "Jacuzzi", hasIndicator: true },
    { icon: Flame, label: "BBQ Grill", hasIndicator: true },
    { icon: Car, label: "Free Parking" },
    { icon: Tv, label: "Smart TV" },
    { icon: Wind, label: "Air Conditioning" },
    { icon: Coffee, label: "Coffee Machine" },
    { icon: Gamepad2, label: "Game Room" },
    { icon: Camera, label: "Security Cameras" },
    { icon: Music, label: "Sound System" },
    { icon: Dumbbell, label: "Fitness Center" },
    { icon: TreePine, label: "Garden View" },
    { icon: Sun, label: "Terrace" },
    { icon: Snowflake, label: "Heating" },
    { icon: Shield, label: "Safe" },
    { icon: Clock, label: "24/7 Support" },
    { icon: Phone, label: "Phone" },
    { icon: Shirt, label: "Laundry Service" },
    { icon: Restaurant, label: "Kitchen" },
    { icon: Bed, label: "Premium Bedding" },
    { icon: Sofa, label: "Living Area" },
    { icon: Refrigerator, label: "Refrigerator" },
    { icon: Microwave, label: "Microwave" },
  ]

  const displayedAmenities = showAllAmenities ? allAmenities : allAmenities.slice(0, 5)
  const remainingCount = allAmenities.length - 5

  return (
    <div className="bg-white min-h-[400px] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="flex-1">
            {/* Property Title & Location */}
            <div className="mb-6">
              <h1 className="text-3xl lg:text-3xl font-bold text-gray-900 mb-3 tracking-tight drop-shadow-lg">
                Barkat Villa - Ramgarh
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium drop-shadow">Nainital, Uttarakhand</span>
              </div>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-6 mb-8">
              <Badge
                variant="secondary"
                className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-3 py-1.5"
              >
                <Award className="w-4 h-4 mr-1.5 text-white" />
                Like a 5⭐ Hotel
              </Badge>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-lg text-white drop-shadow">4.8</span>
                  <span className="text-white/80">/5</span>
                </div>
                <Button variant="link" className="text-white hover:text-white/80 p-0 h-auto font-medium drop-shadow">
                  65 Reviews
                </Button>
              </div>
            </div>

            {/* Property Details Grid */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Badge variant="secondary" className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full">
                <Users className="w-4 h-4 mr-2 text-gray-600" />
                Up to 15 Guests
              </Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full">
                <Home className="w-4 h-4 mr-2 text-gray-600" />5 Rooms
                <Info className="w-4 h-4 ml-2 text-blue-600" />
              </Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full">
                <Bath className="w-4 h-4 mr-2 text-gray-600" />5 Baths
              </Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full">
                <ChefHat className="w-4 h-4 mr-2 text-gray-600" />
                Meals Available
              </Badge>
            </div>

            {/* Great For Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium text-gray-900">Great for:</span>
                <div className="flex items-center gap-2">
                  <Mountain className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800 font-medium">Mountain Retreat</span>
                </div>
              </div>
            </div>

            {/* Premium Amenities */}
            <div className="flex flex-wrap items-center gap-3 w-1/2">
              {displayedAmenities.map((amenity, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-gray-200 text-gray-700 px-3 py-2 rounded-full bg-white hover:bg-gray-50"
                >
                  <amenity.icon className="w-4 h-4 mr-2 text-gray-600" />
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

          {/* <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:bg-white">
              <div className="text-center">
                <div className="mb-2">
                  <span className="text-gray-500 line-through text-lg">₹58,750</span>
                  <Badge variant="destructive" className="ml-2 text-xs bg-red-500 border-0">
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
          </div> */}
        </div>
      </div>
    </div>
  )
}
