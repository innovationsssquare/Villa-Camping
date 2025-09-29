import React from "react";
import {
  Star,
  Users,
  Bed,
  Bath,
  MapPin,
  Mountain,
  Utensils,
  Wifi,
  Coffee,
  Waves,
  Plus,
} from "lucide-react";
import { FaFilePdf } from "react-icons/fa6";

const TentDetails = () => {
  return (
    <div className="p-3  space-y-3 w-full overflow-hidden">
      {/* Title and Location */}
      <div>
        <h1 className="text-xl font-bold text-villa-text-dark">
          Vastalya Villa - Malawali
        </h1>
        <div className="flex justify-between items-center">
          <p className="text-xs font-medium">Malawali, Lonavala</p>
          <button className="mt-2 flex justify-center items-center gap-2 text-red-500/60 text-xs font-medium bg-orange-500/10 px-3 py-1 rounded-lg">
            <FaFilePdf /> View Brochure
          </button>
        </div>
      </div>

      {/* Rating and Reviews */}
      <div className="flex items-center space-x-4">
        <div className="bg-villa-orange/10  py-1 rounded-full">
          <span className="text-sm font-medium">Guest Favourite</span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">5</span>
          <span className="text-villa-text-light font-light">/ 5</span>
        </div>
        <button className="text-blue-500 text-sm underline">67 Reviews</button>
      </div>

      {/* Property Details */}
      <div className="flex items-center w-full space-x-3 text-xs">
        <div className="flex items-center justify-center  py-2 px-1 gap-1 rounded-sm   bg-[#2f80ed1a]">
          <Users className="w-4 h-4 font-light" />
          <span>Up to 15 Guests</span>
        </div>
        <div className="flex items-center justify-center  py-2 px-1 gap-1 rounded-sm   bg-[#2f80ed1a]">
          <Bed className="w-4 h-4 text-villa-text-light" />
          <span>5 Rooms</span>
          <div className="w-4 h-4 bg-villa-blue rounded-full flex items-center justify-center">
            <span className="text-white text-xs">i</span>
          </div>
        </div>
        <div className="flex items-center justify-center  py-2 px-1 gap-1 rounded-sm   bg-[#2f80ed1a]">
          <Bath className="w-4 h-4 text-villa-text-light" />
          <span>5 Baths</span>
        </div>
      </div>

      {/* Great For Section */}
      <div className="flex items-center">
        <p className="text-sm text-villa-text-light">Great for:</p>
        <div className="flex items-center space-x-2">
          <div className="bg-villa-green/10 px-3 py-1 rounded-full">
            <span className="text-xs flex items-center gap-1">
              <Mountain className="text-gray-600" />
              View
            </span>
          </div>
        </div>
      </div>

      {/* Amenities Icons */}
      <div className="grid grid-cols-5 gap-4">
        <div className="text-center">
          <div className="w-12 h-12 border border-gray-400 rounded-md flex items-center justify-center mb-2">
            <Mountain className="w-6 h-6 text-gray-600 font-extralight " />
          </div>
          <p className="text-xs">Mountain View</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 border border-gray-400 rounded-md flex items-center justify-center mb-2">
            <Utensils className="w-6 h-6 text-gray-600 font-extralight " />
          </div>
          <p className="text-xs">Breakfast Included</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 border border-gray-400 rounded-md flex items-center justify-center mb-2">
            <Wifi className="w-6 h-6 text-gray-600 font-extralight " />
          </div>
          <p className="text-xs">WiFi</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 border border-gray-400 rounded-md flex items-center justify-center mb-2">
            <Coffee className="w-6 h-6 text-gray-600 font-extralight " />
          </div>
          <p className="text-xs">Jacuzzi</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 border border-gray-400 rounded-md flex items-center justify-center mb-2">
            <Waves className="w-6 h-6 text-gray-600 font-extralight " />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-villa-blue rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">+20</span>
            </div>
          </div>
          <p className="text-xs">BBQ Grill</p>
        </div>
      </div>
    </div>
  );
};

export default TentDetails;
