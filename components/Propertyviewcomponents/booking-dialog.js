"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@heroui/react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  FaTimes,
  FaChevronDown,
  FaPercent,
  FaTicketAlt,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import CouponsDrawer from "./coupons-drawer";
import GuestSelectionDrawer from "./guest-selection-drawer";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import ButtonLoader from "../Loadercomponents/button-loader";
import Script from "next/script";
import { useDispatch, useSelector } from "react-redux";
import {
  setCheckin,
  setCheckout,
  setSelectedGuest,
  setAppliedCoupon,
  removeCoupon,
} from "@/Redux/Slices/bookingSlice";
import { calculateBookingPrice } from "@/lib/bookingUtils";
import { X } from "lucide-react";

export default function BookingDialog({
  isOpen,
  Setopen,
  onClose,
  propertyName,
  price,
  originalPrice,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [preBookMeals, setPreBookMeals] = useState(false);
  const [isCouponsDrawerOpen, setIsCouponsDrawerOpen] = useState(false);
  const [isGuestDrawerOpen, setIsGuestDrawerOpen] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState("checkin");

  const dispatch = useDispatch();
  const booking = useSelector((state) => state.booking);
  const selectedGuest = booking?.selectedGuest;
  const checkinISO = booking?.checkin;
  const checkoutISO = booking?.checkout;
  const router = useRouter();
  const appliedCoupon = useSelector((state) => state.booking.appliedCoupon);

  // Convert ISO strings to Date for UI
  const checkInDate = checkinISO ? new Date(checkinISO) : new Date();
  const checkOutDate = checkoutISO
    ? new Date(checkoutISO)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);

  const guestCounts = {
    adults: Number(selectedGuest?.adults ?? 2),
    // booking slice uses `childrenn` key; map it here safely
    children: Number(selectedGuest?.childrenn ?? 0),
    infants: Number(selectedGuest?.infants ?? 0),
  };

  const totalGuests =
    guestCounts.adults + guestCounts.children + guestCounts.infants;

  // Nights between check-in/out (min 1)
  const msPerDay = 1000 * 60 * 60 * 24;
  const nights = Math.max(
    1,
    Math.round((+checkOutDate - +checkInDate) / msPerDay)
  );

  const basePrice = price * nights;

  const { discountAmount, finalTotal } = calculateBookingPrice(
    price,
    nights,
    appliedCoupon
  );

  const handleBooking = () => {
    setIsLoading(true);
    // Simulate booking process
    setTimeout(() => {
      setIsLoading(false);
      router.push("/checkout");
    }, 3000);
  };

  const handleApplyCoupon = (coupon) => {
    dispatch(setAppliedCoupon(coupon));
    setIsCouponsDrawerOpen(false);
    confetti({ particleCount: 100, spread: 70, origin: { y: 1.2 } });
  };

  const handleRemoveCouponClick = () => {
    dispatch(removeCoupon());
  };

  const handleGuestCountsChange = (newCounts) => {
    dispatch(
      setSelectedGuest({
        adults: newCounts.adults,
        childrenn: newCounts.children,
        infants: newCounts.infants,
      })
    );
  };

  const handleDateSelect = (date) => {
    if (!date) return;
    if (datePickerType === "checkin") {
      // If check-in >= current check-out, push check-out by +1 day
      const nextCheckout =
        date >= checkOutDate
          ? new Date(date.getTime() + msPerDay)
          : checkOutDate;
      dispatch(setCheckin(date.toISOString()));
      dispatch(setCheckout(nextCheckout.toISOString()));
    } else {
      dispatch(setCheckout(date.toISOString()));
    }
    setShowDatePicker(false);
  };

  const openDatePicker = (type) => {
    setDatePickerType(type);
    setShowDatePicker(true);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <>
      <Drawer
        open={isOpen}
        onOpenChange={Setopen}
        shouldScaleBackground={false}
      >
        <DrawerContent className="max-h-[95vh]  border-none">
          <DrawerHeader className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between px-3 w-full">
              {showDatePicker ? (
                <>
                  <DrawerTitle className="text-xl font-bold text-black">
                    Select{" "}
                    {datePickerType === "checkin" ? "Check-in" : "Check-out"}{" "}
                    Date
                  </DrawerTitle>
                  <Button
                    variant="light"
                    isIconOnly
                    onPress={() => setShowDatePicker(false)}
                    className="rounded-full border-gray-300 border bg-white p-1 hover:bg-black"
                  >
                    <X size={15} className=" text-black" />
                  </Button>
                 
                </>
              ) : (
                <>
                  <DrawerTitle className="text-xl font-bold text-black">
                    {propertyName}
                  </DrawerTitle>
                  <Button
                    variant="light"
                    size="icon"
                    onPress={onClose}
                    className="rounded-full p-1 border-gray-300 border "
                  >
                    <X className="h-5 w-5 text-black" />
                  </Button>
                </>
              )}
            </div>
          </DrawerHeader>

          <div className="p-2 space-y-2 overflow-y-auto flex-1">
            {showDatePicker ? (
              <div className="flex justify-center p-1">
                <Calendar
                  mode="single"
                  selected={
                    datePickerType === "checkin" ? checkInDate : checkOutDate
                  }
                  onSelect={handleDateSelect}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (datePickerType === "checkout") {
                      return date < checkInDate;
                    }
                    return date < today;
                  }}
                  className="rounded-md border border-gray-200 w-full"
                />
              </div>
            ) : (
              <>
                {/* Price */}
                <div className="px-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-black">
                      ₹{price}
                    </span>
                    {originalPrice && (
                      <span className="text-gray-500 line-through">
                        ₹{originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">Per night + taxes</p>
                </div>

                <div className="grid grid-cols-2 gap-4 px-2">
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">
                      Check-in
                    </label>
                    <Button
                      size=""
                      onPress={() => openDatePicker("checkin")}
                      className="w-full  border bg-white  rounded-lg p-3 border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col items-start gap-1">
                          <p className="font-semibold text-black text-sm">
                            {formatDate(checkInDate)}
                          </p>
                          <p className="text-xs text-gray-600">2:00pm</p>
                        </div>
                        <FaChevronDown size={12} className=" text-black" />
                      </div>
                    </Button>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">
                      Check-out
                    </label>
                    <Button
                      size=""
                      onPress={() => openDatePicker("checkout")}
                      className="w-full  border bg-white  rounded-lg p-3 border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col items-start gap-1">
                          <p className="font-semibold text-black text-sm">
                            {formatDate(checkOutDate)}
                          </p>
                          <p className="text-xs text-gray-600">11:00am</p>
                        </div>
                        <FaChevronDown size={12} className=" text-black" />
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Guests */}
                <div className="px-2">
                  <label className="text-sm text-gray-500 mb-1 block ">
                    Guests
                  </label>
                  <Button
                    size=""
                    onPress={() => setIsGuestDrawerOpen(true)}
                    className="w-full border bg-white rounded-lg p-3 border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium text-sm text-black">
                        {guestCounts?.adults} Guest | {guestCounts?.children}{" "}
                        children
                      </span>
                      <span className="font-semibold text-sm text-black">
                        {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
                      </span>
                      <FaChevronDown size={12} className=" text-black" />
                    </div>
                  </Button>
                </div>

                {appliedCoupon && (
                  <div className="px-2">
                    <Card className="p-4 bg-white border-gray-300 border shadow-none px-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <FaPercent className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-black">
                              {appliedCoupon.code}
                            </p>
                            <p className="text-sm text-green-600">
                              ₹{discountAmount.toLocaleString()} Discount
                              applied!
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="light"
                          className="text-red-500 border border-red-500 hover:text-red-600 hover:bg-red-50"
                          onPress={handleRemoveCouponClick}
                        >
                          Remove
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}

                <div className="flex items-center justify-end">
                  <Button
                    variant="light"
                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                    onPress={() => setIsCouponsDrawerOpen(true)}
                  >
                    <FaTicketAlt className="h-4 w-4 mr-2" />
                    View more coupons
                    <FaArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>

                {/* Total */}
                <div className="border-t pt-2 border-gray-200 px-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-lg font-bold text-black">
                        Total
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-black">
                        ₹{finalTotal.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">(Incl. taxes)</p>
                    </div>
                  </div>
                </div>

                {/* Book Button */}
                <Button
                  className="w-full h-12 text-lg font-semibold bg-black hover:bg-gray-800 text-white rounded-lg"
                  onPress={handleBooking}
                  disabled={isLoading}
                >
                  {isLoading ? <ButtonLoader /> : "Proceed"}
                </Button>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      <CouponsDrawer
        isOpen={isCouponsDrawerOpen}
        onClose={() => setIsCouponsDrawerOpen(false)}
        onApplyCoupon={handleApplyCoupon}
        appliedCoupon={appliedCoupon}
      />

      <GuestSelectionDrawer
        isOpen={isGuestDrawerOpen}
        onClose={() => setIsGuestDrawerOpen(false)}
        guestCounts={guestCounts}
        onGuestCountsChange={handleGuestCountsChange}
      />
    </>
  );
}
