"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@heroui/react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  FaTimes,
  FaInfoCircle,
  FaChevronDown,
  FaPercent,
  FaTicketAlt,
  FaArrowRight,
  FaUndo,
  FaArrowLeft,
} from "react-icons/fa";
import CouponsDrawer from "./coupons-drawer";
import GuestSelectionDrawer from "./guest-selection-drawer";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { useLinkStatus } from 'next/link'
import ButtonLoader from "../Loadercomponents/button-loader";

export default function BookingDialog({
  isOpen,
  onClose,
  propertyName,
  price,
  originalPrice,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [preBookMeals, setPreBookMeals] = useState(false);
  const [guestCounts, setGuestCounts] = useState({
    adults: 2,
    children: 0,
    infants: 0,
  });
  const [isCouponsDrawerOpen, setIsCouponsDrawerOpen] = useState(false);
  const [isGuestDrawerOpen, setIsGuestDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState({
    code: "THEVILLACAMP",
    title: "Get 5% off your next getaway",
    description: "Get 5% upto 1500 off on your next getaway!",
    discount: 5,
    maxDiscount: 1500,
    validTill: "31 December 2025",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState("checkin");
  const [checkInDate, setCheckInDate] = useState(new Date(2024, 7, 24)); // Aug 24, 2024
  const [checkOutDate, setCheckOutDate] = useState(new Date(2024, 7, 26)); // Aug 26, 2024
const router=useRouter()
  const { pending } = useLinkStatus()


  const totalGuests =
    guestCounts.adults + guestCounts.children + guestCounts.infants;

  const basePrice = price;
  const discountAmount = appliedCoupon
    ? Math.min(
        (basePrice * appliedCoupon.discount) / 100,
        appliedCoupon.maxDiscount
      )
    : 0;
  const totalPrice = basePrice - discountAmount;
  const taxAmount = Math.round(totalPrice * 0.18); // 18% tax
  const finalTotal = totalPrice + taxAmount;

  const handleBooking = () => {
    setIsLoading(true);
    // Simulate booking process
    setTimeout(() => {
      setIsLoading(false);
      router.push("/checkout")
    }, 3000);
  };

  const handleApplyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
    setIsCouponsDrawerOpen(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 1.2 },
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const handleGuestCountsChange = (newCounts) => {
    setGuestCounts(newCounts);
  };

  const handleDateSelect = (date) => {
    if (!date) return;

    if (datePickerType === "checkin") {
      setCheckInDate(date);
      // If check-in is after check-out, update check-out to next day
      if (date >= checkOutDate) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        setCheckOutDate(nextDay);
      }
    } else {
      setCheckOutDate(date);
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
        onOpenChange={() => {}}
        shouldScaleBackground={false}
      >
        <DrawerContent className="max-h-[95vh] bg-gray-50 border-none">
          <DrawerHeader className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between px-3 w-full">
              {showDatePicker ? (
                <>
                  <Button
                    variant="ghost"
                    isIconOnly
                    onPress={() => setShowDatePicker(false)}
                    className="rounded-md bg-gray-300 border-white p-2 hover:bg-black"
                  >
                    <FaArrowLeft className="h-6 w-6 text-black" />
                  </Button>
                  <DrawerTitle className="text-xl font-bold text-black">
                    Select{" "}
                    {datePickerType === "checkin" ? "Check-in" : "Check-out"}{" "}
                    Date
                  </DrawerTitle>
                  <div className="w-10" /> {/* Spacer */}
                </>
              ) : (
                <>
                  <DrawerTitle className="text-xl font-bold text-black">
                    {propertyName}
                  </DrawerTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onPress={onClose}
                    className="rounded-md bg-gray-300 hover:bg-gray-100"
                  >
                    <FaTimes className="h-5 w-5 text-black" />
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
                      ₹{price.toLocaleString()}
                    </span>
                    {originalPrice && (
                      <span className="text-gray-500 line-through">
                        ₹{originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">
                    (For 1 room) Per night + taxes
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 px-2">
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">
                      Check-in
                    </label>
                    <Button
                      size=""
                      onPress={() => openDatePicker("checkin")}
                      className="w-full border border-white rounded-lg p-3 bg-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col items-start gap-1">
                          <p className="font-semibold text-black">
                            {formatDate(checkInDate)}
                          </p>
                          <p className="text-sm text-gray-600">2:00pm</p>
                        </div>
                        <FaChevronDown className="h-4 w-4 text-black" />
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
                      className="w-full border border-white rounded-lg p-3 bg-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col items-start gap-1">
                          <p className="font-semibold text-black">
                            {formatDate(checkOutDate)}
                          </p>
                          <p className="text-sm text-gray-600">11:00am</p>
                        </div>
                        <FaChevronDown className="h-4 w-4 text-black" />
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
                    className="w-full border border-white rounded-lg p-3 bg-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium text-black">
                       { guestCounts?.adults} Guest |  {guestCounts?.children} children
                      </span>
                      <span className="font-semibold text-black">
                        {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
                      </span>
                      <FaChevronDown className="h-4 w-4 text-black" />
                    </div>
                  </Button>
                </div>

                {appliedCoupon && (
                  <div className="px-2">
                    <Card className="p-4 border-white bg-gray-300 shadow-none px-3">
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
                          variant="ghost"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onPress={handleRemoveCoupon}
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
                      <span className="text-xl font-bold text-black">
                        Total
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-black">
                        ₹{finalTotal.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">(Incl. taxes)</p>
                    </div>
                  </div>
                </div>

                {/* Book Button */}
                <Button
                  className="   w-full h-12 text-lg font-semibold bg-black hover:bg-gray-800 text-white rounded-lg"
                  onPress={handleBooking}
                  disabled={isLoading}
                >
                  {isLoading ? <ButtonLoader/> : "Procced"}
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
