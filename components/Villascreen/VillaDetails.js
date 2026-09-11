import React from "react";
import CustomAmenityIcon from "@/components/ui/CustomAmenityIcon";
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
  Sun,
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
          <p className="text-xs font-medium text-gray-500">
            {villa?.address?.addressLine}, {villa?.address?.city}
          </p>
          <Button
            size="sm"
            className="mt-1 flex justify-center items-center gap-1.5 text-[#ff6900] text-xs font-semibold bg-orange-50 border border-orange-200/80 hover:bg-orange-100 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
          >
            <FaFilePdf /> View Brochure
          </Button>
        </div>
      </div>

      {/* Rating and Reviews */}
      <div className="flex items-center space-x-3">
        <div className="bg-orange-50/80 border border-orange-200/70 px-2.5 py-0.5 rounded-full">
          <span className="text-xs font-bold text-orange-800">Guest Favourite</span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-bold text-sm text-gray-900">{villa?.averageRating || "4.8"}</span>
          <span className="text-gray-400 text-xs">/ 5</span>
        </div>
        <Link
          href={"#reviews"}
          scroll={true}
          className="text-[#ff6900] text-xs font-semibold underline underline-offset-2"
        >
          {villa?.totalReviews || 0} Reviews
        </Link>
      </div>

      {/* Property Details */}
      <div className="flex items-center w-full space-x-2 text-xs">
        <div className="flex-1 flex items-center justify-center py-2 px-2 gap-1.5 rounded-xl bg-neutral-100/90 border border-neutral-200/60 font-medium text-gray-800">
          <Users className="w-3.5 h-3.5 text-[#ff6900]" />
          <span>Up to {villa?.maxCapacity} Guests</span>
        </div>
        <div className="flex-1 flex items-center justify-center py-2 px-2 gap-1.5 rounded-xl bg-neutral-100/90 border border-neutral-200/60 font-medium text-gray-800 relative">
          <Bed className="w-3.5 h-3.5 text-[#ff6900]" />
          <span>{villa?.rooms} Rooms</span>
        </div>
        <div className="flex-1 flex items-center justify-center py-2 px-2 gap-1.5 rounded-xl bg-neutral-100/90 border border-neutral-200/60 font-medium text-gray-800">
          <Bath className="w-3.5 h-3.5 text-[#ff6900]" />
          <span>{villa?.baths} Baths</span>
        </div>
      </div>

      {/* Great For Section */}
      {villa?.greatFor?.length > 0 && (
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2 items-center">
            <p className="text-xs text-gray-500 font-medium">Great for:</p>
            {villa.greatFor.slice(0, 1).map((item, index) => (
              <div
                key={index}
                className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-medium text-xs"
              >
                {greatForIcons[item] || (
                  <Sun className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Amenities Icons */}
      {villa?.topamenities?.length > 0 && (
        <div className="grid grid-cols-5 gap-3 mt-2">
          {villa?.topamenities.slice(0, 5).map((amenity, index) => (
            <div
              key={index}
              className="text-center relative flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-white border border-neutral-200 rounded-xl flex items-center justify-center mb-1.5 shadow-2xs relative">
                <CustomAmenityIcon name={amenity} className="w-5 h-5 text-[#ff6900]" />
                {index === 4 && villa.topamenities.length > 5 && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#ff6900] text-white rounded-full flex items-center justify-center shadow-xs">
                    <span className="text-[10px] font-bold">
                      +{villa?.amenities?.length - 4}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[0.65rem] text-center font-medium text-gray-700 truncate w-full">{amenity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VillaDetails;
