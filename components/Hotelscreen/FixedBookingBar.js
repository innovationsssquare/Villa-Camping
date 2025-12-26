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
import { useHotel } from "@/lib/context/HotelContext";

const FixedBookingBar = () => {
  const dispatch = useDispatch();
  const booking = useSelector((state) => state.booking);
  const selectedGuest = booking?.selectedGuest;
  const hotel = useHotel();

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
    hotel?.pricing ?? {}
  );

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
              <span className="text-sm text-price-original">Starts from -</span>
              <span className="text-lg font-bold text-price-current">
                {formatRupee(basePrice)}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-villa-text-light">
              <span>2 Guests</span>
              <Button
                onPress={() => {
                  dispatch(setPropertyId(hotel?._id));
                  dispatch(setcategoryId(hotel?.category));
                  dispatch(setOwnerId(hotel?.owner));
                  dispatch(setPropertyType("Hotels"));
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
              dispatch(setPropertyId(hotel?._id));
              dispatch(setcategoryId(hotel?.category));
              dispatch(setOwnerId(hotel?.owner));
              dispatch(setPropertyType("hotel"));
              setIsBookingOpen(true);
            }}
            className="bg-black text-white px-4 py-1 rounded-full text-sm hover:bg-villa-text-dark/90"
            size="lg"
          >
            Select Dates / Rooms
          </Button>
        </div>
      </div>

      <BookingDialog
        isOpen={isBookingOpen}
        Setopen={setIsBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        propertyName={hotel?.name}
        price={basePrice}
        originalPrice={basePrice + 3000}
        propertyId={hotel?._id}
        ownerId={hotel?.owner}
        propertyType="Hotel"
        rooms={hotel?.rooms}
        // customerId:={}
      />
    </>
  );
};

export default FixedBookingBar;
