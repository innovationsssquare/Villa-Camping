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

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-gray-200 p-2 z-40">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-price-original line-through">
                ₹{villa.pricing.weekdayPrice + 3000}
              </span>
              <span className="text-lg font-bold text-price-current">
                ₹{villa.pricing.weekdayPrice}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-villa-text-light">
              <span> {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}</span>
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
        price={villa?.weekdayPrice}
        originalPrice={villa?.weekdayPrice + 3000}
        propertyId={villa?._id}
        ownerId={villa?.owner}
        propertyType="Villa"
        // customerId:={}
      />
    </>
  );
};

export default FixedBookingBar;
