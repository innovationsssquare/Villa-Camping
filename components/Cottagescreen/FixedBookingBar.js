"use client";
import React, { useState } from "react";
import { Button } from "@heroui/react";
import { SquarePen } from "lucide-react";
import {
  setcategoryId,
  setOwnerId,
  setPropertyId,
  setPropertyType,
} from "@/Redux/Slices/bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import { calculateBasePriceForRange } from "@/lib/datePricing";
import { useCamping } from "@/lib/context/CampingContext";
import BookingDialog from "../Propertyviewcomponents/booking-dialog";
import { useCottage } from "@/lib/context/CottageContext";

const FixedBookingBar = () => {
  const dispatch = useDispatch();
  const booking = useSelector((state) => state.booking);
  const selectedGuest = booking?.selectedGuest;
  const cottage = useCottage();

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { checkin, checkout } = useSelector((state) => state.booking);
  const checkInDate = checkin ? new Date(checkin) : new Date();
  const checkOutDate = checkout
    ? new Date(checkout)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);

  const guestCounts = {
    adults: Number(selectedGuest?.adults ?? 2),
    // booking slice uses `childrenn` key; map it here safely
    children: Number(selectedGuest?.childrenn ?? 0),
    infants: Number(selectedGuest?.infants ?? 0),
  };

  const totalGuests =
    guestCounts.adults + guestCounts.children + guestCounts.infants;

  const basePrice = calculateBasePriceForRange(
    checkInDate?.toISOString(),
    checkOutDate?.toISOString(),
    cottage?.pricing ?? {}
  );

  function formatRupee(amount) {
    if (amount == null || Number.isNaN(Number(amount))) return "₹0";
    // no decimal places - change maximumFractionDigits if needed
    const formatted = new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Number(amount));
    return `₹${formatted}`;
  }

  const [bookingTab, setBookingTab] = useState("dates");

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-md border-t border-gray-200/90 px-4 pt-2.5 z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-extrabold text-gray-950 tracking-tight">
                {formatRupee(basePrice)}
              </span>
              <span className="text-xs sm:text-sm text-gray-400 line-through font-normal ml-0.5">
                {formatRupee(basePrice + 2500)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="font-semibold text-gray-800">
                {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
              </span>
              <button
                type="button"
                onClick={() => {
                  dispatch(setPropertyId(cottage?._id));
                  dispatch(setcategoryId(cottage?.category));
                  dispatch(setOwnerId(cottage?.owner));
                  dispatch(setPropertyType("Cottage"));
                  setBookingTab("guests");
                  setIsBookingOpen(true);
                }}
                className="p-1 -my-1 text-[#ff6900] hover:text-[#e05d00] active:scale-90 transition-transform cursor-pointer inline-flex items-center touch-manipulation"
                aria-label="Edit guests"
              >
                <SquarePen className="w-3.5 h-3.5 text-[#ff6900]" />
              </button>
              <span className="text-gray-300 font-bold">·</span>
              <span className="text-gray-500 text-xs">night + taxes</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              dispatch(setPropertyId(cottage?._id));
              dispatch(setcategoryId(cottage?.category));
              dispatch(setOwnerId(cottage?.owner));
              dispatch(setPropertyType("Cottage"));
              setBookingTab("dates");
              setIsBookingOpen(true);
            }}
            className="bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c55000] text-white px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap shadow-md shadow-orange-500/25 active:scale-[0.97] transition-transform duration-100 cursor-pointer inline-flex items-center justify-center shrink-0 h-11 sm:h-12 touch-manipulation select-none"
          >
            Select Dates / Cottages
          </button>
        </div>
      </div>

      <BookingDialog
        isOpen={isBookingOpen}
        Setopen={setIsBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        propertyName={cottage?.name}
        price={basePrice}
        originalPrice={basePrice + 2500}
        propertyId={cottage?._id}
        ownerId={cottage?.owner}
        propertyType="Cottage"
        pricing={cottage?.pricing}
        cottages={cottage?.cottages}
        initialTab={bookingTab}
        // customerId:={}
      />
    </>
  );
};

export default FixedBookingBar;
