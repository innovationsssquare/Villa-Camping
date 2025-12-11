import React from "react";
import {
  Wifi,
  Snowflake,
  AirVent,
  BatteryCharging,
  GlassWater,
  ShieldCheck,
  Bed,
  Droplet,
  Tv as LucideTv,
  Table,
  Bath,
  Waves,
  Volume2,
  Utensils as LucideUtensils,
  Coffee,
  Trees,
  Home,
  Flame,
  Fire,
  Lightbulb,
  Star,
  MapPin,
  Users,
  BadgeCheck,
  Heart,
  Share2,
  FlameKindling,
  Camera,
  Mountain,
  Building2,
} from "lucide-react";

// react-icons for items lucide doesn't provide (or where a better semantic icon exists)
import {
  FaSquareParking,
  FaTv,
  FaFilePdf,
  FaPeopleGroup,
  FaChild,
  FaUmbrellaBeach,
} from "react-icons/fa6";
import {
  MdKitchen,
  MdOutlineLocalDining,
  MdOutlineFreeBreakfast,
  MdOutlineSpeaker ,
  MdPool 
} from "react-icons/md";
import { useVilla } from "@/lib/context/VillaContext";
import { Button } from "@heroui/react";
import Link from "next/link";

const VillaDetails = () => {
  const villa = useVilla();

  const greatForIcons = {
    "Mountain View": <Mountain className="w-4 h-4 text-gray-600" />,
    "Ideal for Families": <FaChild className="w-4 h-4 text-gray-600" />,
    "Ideal for Groups": <FaPeopleGroup className="w-4 h-4 text-gray-600" />,
    Beachfront: <FaUmbrellaBeach className="w-4 h-4 text-gray-600" />,
    "Nature Retreat": <Trees className="w-4 h-4 text-gray-600" />,
    "Romantic Getaway": <Heart className="w-4 h-4 text-gray-600" />,
  };

  const amenitiesIcons = {
    WiFi: <Wifi className="w-6 h-6 text-gray-600" />,
    Heating: <Snowflake className="w-6 h-6 text-gray-600" />,
    AC: <AirVent className="w-6 h-6 text-gray-600" />,
    "Power Backup": <BatteryCharging className="w-6 h-6 text-gray-600" />,
    "Water Supply": <GlassWater className="w-6 h-6 text-gray-600" />,
    Security: <ShieldCheck className="w-6 h-6 text-gray-600" />,
    CCTV: <Camera className="w-6 h-6 text-gray-600" />, // If you don't have Camera from lucide, use another (see note below)
    Parking: <FaSquareParking className="w-6 h-6 text-gray-600" />,
    "AC Bedrooms/Hall": <AirVent className="w-6 h-6 text-gray-600" />,
    "Aquagaurd for drinking water": (
      <Droplet className="w-6 h-6 text-gray-600" />
    ),
    "Extra mattresses": <Bed className="w-6 h-6 text-gray-600" />,

    "LED TV Mobile Connect": <FaTv className="w-6 h-6 text-gray-600" />,
    "Board Games": <Star className="w-6 h-6 text-gray-600" />, // fallback to star if no specific game icon
    "Sunset Point": <Star className="w-6 h-6 text-gray-600" />,
    "Table & Chairs": <Table className="w-6 h-6 text-gray-600" />,
    "Geyser in all Bathrooms": <Bath className="w-6 h-6 text-gray-600" />,

    "Swimming Pool": <MdPool  className="w-6 h-6 text-gray-600" />,
    "Sound System": <MdOutlineSpeaker  className="w-6 h-6 text-gray-600" />,
    Refrigerator: <MdKitchen className="w-6 h-6 text-gray-600" />,
    Kitchen: <MdKitchen className="w-6 h-6 text-gray-600" />,
    "Coffee Maker": <Coffee className="w-6 h-6 text-gray-600" />,
    Microwave: <MdKitchen className="w-6 h-6 text-gray-600" />,
    Oven: <MdKitchen className="w-6 h-6 text-gray-600" />,

    "Outdoor Dining Area": <Trees className="w-6 h-6 text-gray-600" />,
    "Dining Area": <MdOutlineLocalDining className="w-6 h-6 text-gray-600" />,
    "BBQ Grill": <FlameKindling className="w-6 h-6 text-gray-600" />,
    Balcony: <Home className="w-6 h-6 text-gray-600" />,
    Garden: <Trees className="w-6 h-6 text-gray-600" />,
    "Terrace / Patio": <Home className="w-6 h-6 text-gray-600" />,

    "Fire Extinguisher": <Flame className="w-6 h-6 text-gray-600" />,
    "Daily Breakfast": (
      <MdOutlineFreeBreakfast className="w-6 h-6 text-gray-600" />
    ),
    "Smart Lighting": <Lightbulb className="w-6 h-6 text-gray-600" />,
  };

  return (
    <div className="p-3  space-y-3 w-full overflow-hidden">
      {/* Title and Location */}
      <div>
        <h1 className="text-xl font-bold text-villa-text-dark">
          {villa?.name} - {villa?.address?.addressLine}
        </h1>
        <div className="flex justify-between items-center">
          <p className="text-xs font-medium">
            {villa?.address?.addressLine}, {villa?.address?.city}
          </p>
          <Button
            size=""
            className="mt-2 flex justify-center items-center gap-2 text-red-500/60 text-xs font-medium bg-orange-500/10 px-3 py-1 rounded-lg"
          >
            <FaFilePdf /> View Brochure
          </Button>
        </div>
      </div>

      {/* Rating and Reviews */}
      <div className="flex items-center space-x-4">
        <div className="bg-villa-orange/10  py-1 rounded-full">
          <span className="text-sm font-medium">Guest Favourite</span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{villa?.averageRating}</span>
          <span className="text-villa-text-light font-light">/ 5</span>
        </div>
        <Link
          href={"#reviews"}
          scroll={true}
          className="text-blue-500 text-sm underline"
        >
          67 Reviews
        </Link>
      </div>

      {/* Property Details */}
      <div className="flex items-center w-full space-x-3 text-xs">
        <div className="flex items-center justify-center  py-2 px-1 gap-1 rounded-sm   bg-[#2f80ed1a]">
          <Users className="w-4 h-4 font-light" />
          <span>Up to {villa?.maxCapacity} Guests</span>
        </div>
        <div className="flex items-center justify-center  py-2 px-1 gap-1 rounded-sm   bg-[#2f80ed1a]">
          <Bed className="w-4 h-4 text-villa-text-light" />
          <span>{villa?.rooms} Rooms</span>
          <div className="w-4 h-4 bg-villa-blue rounded-full flex items-center justify-center">
            <span className="text-white text-xs">i</span>
          </div>
        </div>
        <div className="flex items-center justify-center  py-2 px-1 gap-1 rounded-sm   bg-[#2f80ed1a]">
          <Bath className="w-4 h-4 text-villa-text-light" />
          <span>{villa?.baths} Baths</span>
        </div>
      </div>

      {/* Great For Section */}
      {villa?.greatFor?.length > 0 && (
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2 items-center">
            <p className="text-sm text-villa-text-light ">Great for:</p>
            {villa.greatFor.slice(0, 1).map((item, index) => (
              <div
                key={index}
                className="bg-villa-green/10 px-3 py-1 rounded-full flex items-center gap-1"
              >
                {greatForIcons[item] || (
                  <Sun className="w-4 h-4 text-gray-600" />
                )}
                <span className="text-xs">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Amenities Icons */}
      {villa?.topamenities?.length > 0 && (
        <div className="grid grid-cols-5 gap-4 mt-2">
          {villa?.topamenities.slice(0, 6).map((amenity, index) => (
            <div
              key={index}
              className="text-center relative flex flex-col items-center"
            >
              <div className="w-12 h-12 border border-gray-400 rounded-md flex items-center justify-center mb-2 relative">
                {amenitiesIcons[amenity] || (
                  <Building2 className="w-6 h-6 text-gray-600" />
                )}
                {index === 5 && villa.topamenities.length > 6 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-villa-blue rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      +{villa?.amenities?.length - 5}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[0.67rem] text-center">{amenity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VillaDetails;
