"use client";
import React, { useState } from "react";
import { Button } from "@heroui/react";
import { SquarePen } from "lucide-react";
import { useVilla } from "@/lib/context/VillaContext";
import BookingDialog from "../Propertyviewcomponents/booking-dialog";
import {
  setcategoryId,
  setOwnerId,
  setPropertyId,
  setPropertyType,
} from "@/Redux/Slices/bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import { calculateBasePriceForRange } from "@/lib/datePricing";

const FixedBookingBar = () => {
  const dispatch = useDispatch();
  const booking = useSelector((state) => state.booking);
  const selectedGuest = booking?.selectedGuest;

  const villa = useVilla();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingTab, setBookingTab] = useState("dates");
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
    villa?.pricing ?? {}
  );

  function isWeekendInIndia(date = new Date()) {
    const dt = typeof date === "string" ? new Date(date) : date;
    // weekday short like "Sat", "Sun", "Mon" etc in the Asia/Kolkata timezone
    const weekdayShort = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
    }).format(dt);

    return weekdayShort === "Sat" || weekdayShort === "Sun";
  }

  function formatRupee(amount) {
    if (amount == null || Number.isNaN(Number(amount))) return "₹0";
    // no decimal places - change maximumFractionDigits if needed
    const formatted = new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Number(amount));
    return `₹${formatted}`;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/80 px-3.5 py-1.5 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[15px] font-bold text-gray-900 tracking-tight">
                {formatRupee(basePrice)}
              </span>
              <span className="text-[10px] text-gray-400 line-through font-normal">
                {formatRupee(basePrice + 3000)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="font-medium text-gray-700">
                {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
              </span>
              <button
                type="button"
                onClick={() => {
                  dispatch(setPropertyId(villa?._id));
                  dispatch(setcategoryId(villa?.category));
                  dispatch(setOwnerId(villa?.owner));
                  dispatch(setPropertyType("Villa"));
                  setBookingTab("guests");
                  setIsBookingOpen(true);
                }}
                className="p-0.5 text-[#ff6900] hover:text-[#e05d00] transition-colors cursor-pointer inline-flex items-center"
                aria-label="Edit guests"
              >
                <SquarePen className="w-2.5 h-2.5 text-[#ff6900]" />
              </button>
              <span className="text-gray-300">·</span>
              <span className="text-gray-500 text-[9.5px]">night + taxes</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              dispatch(setPropertyId(villa?._id));
              dispatch(setcategoryId(villa?.category));
              dispatch(setOwnerId(villa?.owner));
              dispatch(setPropertyType("Villa"));
              setBookingTab("dates");
              setIsBookingOpen(true);
            }}
            className="bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c55000] text-white px-3.5 py-1.5 rounded-lg font-semibold text-[11px] whitespace-nowrap shadow-xs shadow-orange-500/20 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center shrink-0 h-8"
          >
            Select Dates
          </button>
        </div>
      </div>

      <BookingDialog
        isOpen={isBookingOpen}
        Setopen={setIsBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        propertyName={villa?.name}
        price={basePrice}
        originalPrice={basePrice + 3000}
        propertyId={villa?._id}
        ownerId={villa?.owner}
        propertyType="Villa"
        pricing={villa?.pricing}
        maxCapacity={villa?.maxCapacity}
        initialTab={bookingTab}
        // customerId:={}
      />
    </>
  );
};

export default FixedBookingBar;
