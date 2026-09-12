"use client";
import React from "react";
import CustomAmenityIcon from "@/components/ui/CustomAmenityIcon";
import {
  Star,
  Users,
  Home,
  Bath,
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
import { useCottage } from "@/lib/context/CottageContext";
import Link from "next/link";

const CottageDetails = () => {
  const cottage = useCottage();

  const greatForIcons = {
    "Mountain View": <Mountain className="w-4 h-4 text-gray-600" />,
    "Ideal for Families": <FaChild className="w-4 h-4 text-gray-600" />,
    "Ideal for Groups": <FaPeopleGroup className="w-4 h-4 text-gray-600" />,
    Beachfront: <FaUmbrellaBeach className="w-4 h-4 text-gray-600" />,
    "Nature Retreat": <Trees className="w-4 h-4 text-gray-600" />,
    "Romantic Getaway": <Heart className="w-4 h-4 text-gray-600" />,
  };

  const totalCottagesCount =
    cottage?.cottages?.reduce(
      (acc, c) => acc + (c?.totalcottage || c?.totaltents || c?.totalCottages || 1),
      0
    ) ||
    cottage?.totalcottage ||
    cottage?.totalCottages ||
    cottage?.cottages?.length ||
    1;

  const totalMaxCapacity =
    cottage?.maxCapacity ||
    cottage?.cottages?.reduce(
      (acc, c) =>
        acc +
        (Number(c?.maxCapacity) || 2) *
          (c?.totalcottage || c?.totaltents || c?.totalCottages || 1),
      0
    ) ||
    10;

  return (
    <div className="p-3 space-y-3 w-full overflow-hidden">
      {/* Title and Location */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900">
          {cottage?.name} {cottage?.address?.addressLine ? `- ${cottage.address.addressLine}` : ""}
        </h1>
        <div className="flex justify-between items-center mt-0.5">
          <p className="text-xs font-medium text-gray-500">
            {cottage?.address?.addressLine ? `${cottage.address.addressLine}, ` : ""}{cottage?.address?.city || "Destination"}
          </p>
          {cottage?.brochure && (
            <a
              href={cottage.brochure}
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
          <span className="font-bold text-sm text-gray-900">{cottage?.averageRating || "4.8"}</span>
          <span className="text-gray-400 text-xs">/ 5</span>
        </div>
        <Link
          href="#reviews"
          scroll={true}
          className="text-[#ff6900] text-xs font-semibold underline underline-offset-2"
        >
          {cottage?.totalReviews || 0} Reviews
        </Link>
      </div>

      {/* Accommodation Details Badges */}
      <div className="flex items-center w-full space-x-2 text-xs">
        <div className="flex-1 flex items-center justify-center py-2 px-2 gap-1.5 rounded-xl bg-neutral-100/90 border border-neutral-200/60 font-medium text-gray-800">
          <Users className="w-3.5 h-3.5 text-[#ff6900]" />
          <span>Up to {totalMaxCapacity} Guests</span>
        </div>
        <div className="flex-1 flex items-center justify-center py-2 px-2 gap-1.5 rounded-xl bg-neutral-100/90 border border-neutral-200/60 font-medium text-gray-800">
          <Home className="w-3.5 h-3.5 text-[#ff6900]" />
          <span>{totalCottagesCount} Cottages</span>
        </div>
        {cottage?.baths > 0 && (
          <div className="flex-1 flex items-center justify-center py-2 px-2 gap-1.5 rounded-xl bg-neutral-100/90 border border-neutral-200/60 font-medium text-gray-800">
            <Bath className="w-3.5 h-3.5 text-[#ff6900]" />
            <span>{cottage.baths} Baths</span>
          </div>
        )}
      </div>

      {/* Great For Section */}
      {cottage?.greatFor?.length > 0 && (
        <div className="pt-1">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">Great for:</span>
            {cottage.greatFor.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-neutral-100 border border-neutral-200/70 text-gray-800 text-[11px] font-medium"
              >
                {greatForIcons[item] || null}
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Top Amenities Preview */}
      {cottage?.topamenities?.length > 0 && (
        <div className="pt-2 border-t border-neutral-100">
          <div className="grid grid-cols-4 gap-2">
            {cottage.topamenities.slice(0, 4).map((amenity, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-neutral-50 border border-neutral-200/70 text-center"
              >
                <CustomAmenityIcon name={amenity} className="w-5 h-5 text-[#ff6900] mb-1" />
                <span className="text-[10px] font-medium text-gray-700 truncate w-full">
                  {amenity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CottageDetails;
