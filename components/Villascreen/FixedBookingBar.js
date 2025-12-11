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

const FixedBookingBar = () => {
  const dispatch = useDispatch();
  const booking = useSelector((state) => state.booking);
  const selectedGuest = booking?.selectedGuest;

  const villa = useVilla();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const guestCounts = {
    adults: Number(selectedGuest?.adults ?? 2),
    // booking slice uses `childrenn` key; map it here safely
    children: Number(selectedGuest?.childrenn ?? 0),
    infants: Number(selectedGuest?.infants ?? 0),
  };

  const totalGuests =
    guestCounts.adults + guestCounts.children + guestCounts.infants;

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
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-gray-200 p-2 z-40">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-price-original line-through">
                {formatRupee(villa.pricing.weekdayPrice + 3000)}
              </span>
              <span className="text-lg font-bold text-price-current">
                {(() => {
                  const useDate =
                    typeof selectedDate !== "undefined"
                      ? selectedDate
                      : new Date();
                  const weekend = isWeekendInIndia(useDate);
                  const weekdayPrice =
                    villa?.pricing?.weekdayPrice ??
                    villa?.pricing?.basePrice ??
                    0;
                  const weekendPrice =
                    villa?.pricing?.weekendPrice ?? weekdayPrice;

                  const displayPrice = weekend ? weekendPrice : weekdayPrice;

                  return (
                    <div className="text-xl font-bold text-price-text">
                      {formatRupee(displayPrice)}
                    </div>
                  );
                })()}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-villa-text-light">
              <span>
                {" "}
                {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
              </span>
              <Button
                onPress={() => {
                  dispatch(setPropertyId(villa?._id));
                  dispatch(setcategoryId(villa?.category));
                  dispatch(setOwnerId(villa?.owner));
                  dispatch(setPropertyType("Villa"));
                  setIsBookingOpen(true);
                }}
                isIconOnly
                variant="light"
                size=""
                className=""
              >
                <SquarePen size={15} />
              </Button>
            </div>
            <p className="text-xs text-villa-text-light">Per night + taxes</p>
          </div>
          <Button
            onPress={() => {
              dispatch(setPropertyId(villa?._id));
              dispatch(setcategoryId(villa?.category));
              dispatch(setOwnerId(villa?.owner));
              dispatch(setPropertyType("Villa"));
              setIsBookingOpen(true);
            }}
            className="bg-black text-white px-4 py-1 rounded-full text-sm hover:bg-villa-text-dark/90"
            size="lg"
          >
            Select Dates
          </Button>
        </div>
      </div>

      <BookingDialog
        isOpen={isBookingOpen}
        Setopen={setIsBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        propertyName={villa?.name}
        price={villa?.pricing?.weekdayPrice}
        originalPrice={villa?.pricing?.weekdayPrice + 3000}
        propertyId={villa?._id}
        ownerId={villa?.owner}
        propertyType="Villa"
        // customerId:={}
      />
    </>
  );
};

export default FixedBookingBar;
