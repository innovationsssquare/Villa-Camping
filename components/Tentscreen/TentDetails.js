import React from "react";
import CustomAmenityIcon from "@/components/ui/CustomAmenityIcon";
import {
  Star,
  Users,
  Tent,
  Bath,
  Sun,
  Heart,
  Trees,
  Mountain,
} from "lucide-react";
import {
  FaFilePdf,
  FaPeopleGroup,
  FaChild,
  FaUmbrellaBeach,
} from "react-icons/fa6";
import { useCamping } from "@/lib/context/CampingContext";
import { Button } from "@heroui/react";
import Link from "next/link";

const TentDetails = () => {
  const camping = useCamping();

  const greatForIcons = {
    "Mountain View": <Mountain className="w-4 h-4 text-gray-600" />,
    "Ideal for Families": <FaChild className="w-4 h-4 text-gray-600" />,
    "Ideal for Groups": <FaPeopleGroup className="w-4 h-4 text-gray-600" />,
    Beachfront: <FaUmbrellaBeach className="w-4 h-4 text-gray-600" />,
    "Nature Retreat": <Trees className="w-4 h-4 text-gray-600" />,
    "Romantic Getaway": <Heart className="w-4 h-4 text-gray-600" />,
  };

  const totalTentsCount = camping?.tents?.reduce(
    (acc, t) => acc + (t?.totaltents || 1),
    0
  ) || camping?.tents?.length || 0;

  const totalMaxCapacity = camping?.maxCapacity || camping?.tents?.reduce(
    (acc, t) => acc + (t?.maxCapacity * (t?.totaltents || 1)),
    0
  ) || 10;

  return (
    <div className="p-3 space-y-3 w-full overflow-hidden">
      {/* Title and Location */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900">
          {camping?.name} {camping?.address?.addressLine ? `- ${camping.address.addressLine}` : ""}
        </h1>
        <div className="flex justify-between items-center mt-0.5">
          <p className="text-xs font-medium text-gray-500">
            {camping?.address?.addressLine ? `${camping.address.addressLine}, ` : ""}{camping?.address?.city || "Pawana"}
          </p>
          {camping?.brochure && (
            <a
              href={camping.brochure}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex justify-center items-center gap-1.5 text-[#ff6900] text-xs font-semibold bg-orange-50 border border-orange-200/80 hover:bg-orange-100 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
            >
              <FaFilePdf /> View Brochure
            </a>
          )}
        </div>
      </div>

      {/* Rating and Reviews */}
      <div className="flex items-center space-x-3">
        <div className="bg-orange-50/80 border border-orange-200/70 px-2.5 py-0.5 rounded-full">
          <span className="text-xs font-bold text-orange-800">Guest Favourite</span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-bold text-sm text-gray-900">{camping?.averageRating || "4.8"}</span>
          <span className="text-gray-400 text-xs">/ 5</span>
        </div>
        <Link
          href="#reviews"
          scroll={true}
          className="text-[#ff6900] text-xs font-semibold underline underline-offset-2"
        >
          {camping?.totalReviews || 0} Reviews
        </Link>
      </div>

      {/* Campsite Accommodation Details Badges */}
      <div className="flex items-center w-full space-x-2 text-xs">
        <div className="flex-1 flex items-center justify-center py-2 px-2 gap-1.5 rounded-xl bg-neutral-100/90 border border-neutral-200/60 font-medium text-gray-800">
          <Users className="w-3.5 h-3.5 text-[#ff6900]" />
          <span>Up to {totalMaxCapacity} Guests</span>
        </div>
        <div className="flex-1 flex items-center justify-center py-2 px-2 gap-1.5 rounded-xl bg-neutral-100/90 border border-neutral-200/60 font-medium text-gray-800">
          <Tent className="w-3.5 h-3.5 text-[#ff6900]" />
          <span>{totalTentsCount} Tents</span>
        </div>
        {camping?.baths > 0 && (
          <div className="flex-1 flex items-center justify-center py-2 px-2 gap-1.5 rounded-xl bg-neutral-100/90 border border-neutral-200/60 font-medium text-gray-800">
            <Bath className="w-3.5 h-3.5 text-[#ff6900]" />
            <span>{camping.baths} Baths</span>
          </div>
        )}
      </div>

      {/* Great For Section */}
      {camping?.greatFor?.length > 0 && (
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2 items-center">
            <p className="text-xs text-gray-500 font-medium">Great for:</p>
            {camping.greatFor.slice(0, 2).map((item, index) => (
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

      {/* Top Amenities Icons Grid */}
      {camping?.topamenities?.length > 0 && (
        <div className="grid grid-cols-5 gap-3 mt-2">
          {camping.topamenities.slice(0, 5).map((amenity, index) => (
            <div
              key={index}
              className="text-center relative flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-white border border-neutral-200 rounded-xl flex items-center justify-center mb-1.5 shadow-2xs relative">
                <CustomAmenityIcon name={amenity} className="w-5 h-5 text-[#ff6900]" />
                {index === 4 && camping.topamenities.length > 5 && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#ff6900] text-white rounded-full flex items-center justify-center shadow-xs">
                    <span className="text-[10px] font-bold">
                      +{camping?.amenities?.length - 4}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[0.65rem] text-center font-medium text-gray-700 truncate w-full">
                {amenity}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TentDetails;
