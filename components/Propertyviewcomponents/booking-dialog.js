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

export default function BookingDialog({
  isOpen,
  onClose,
  propertyName,
  price,
  originalPrice,
  propertyId,
  ownerId,
  propertyType = "Villa",
  unitTypeName, // e.g., villa.bhkType
  customerId, // optional: if you have auth user id available
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

  // const handleBooking = async () => {
  //   try {
  //     setIsLoading(true)

  //     // Build booking payload aligned to your Booking schema
  //     const bookingPayload = {
  //       propertyType,
  //       propertyId,
  //       ownerId,
  //       customerId, // If not available, API may reject (schema requires); see note in postamble
  //       checkIn: checkInDate.toISOString(),
  //       checkOut: checkOutDate.toISOString(),
  //       guests: {
  //         adults: guestCounts.adults,
  //         children: guestCounts.children,
  //       },
  //       items: [
  //         {
  //           unitType:
  //             propertyType === "Villa"
  //               ? "VillaUnit"
  //               : propertyType === "Hotel"
  //                 ? "RoomUnit"
  //                 : propertyType === "Camping"
  //                   ? "Tent"
  //                   : "CottageUnit",
  //           unitId: propertyId,
  //           typeName: unitTypeName || propertyName,
  //           quantity: 1,
  //           pricePerNight: price,
  //           totalPrice: basePrice,
  //         },
  //       ],
  //       payment: {
  //         amount: finalTotal,
  //         currency: "INR",
  //         status: "pending",
  //       },
  //     }

  //     // Create Razorpay order via server
  //     const orderRes = await fetch("/api/razorpay/create-order", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         amount: finalTotal,
  //         currency: "INR",
  //         booking: bookingPayload,
  //       }),
  //     })

  //     if (!orderRes.ok) {
  //       const err = await orderRes.json().catch(() => ({}))
  //       throw new Error(err?.message || "Failed to create order")
  //     }

  //     const { order, publicKey } = await orderRes.json()

  //     // Initialize Razorpay Checkout
  //     const options = {
  //       key: publicKey, // prefer NEXT_PUBLIC key from server
  //       amount: order.amount,
  //       currency: order.currency,
  //       name: propertyName,
  //       description: "Booking payment",
  //       order_id: order.id,
  //       handler: async (response) => {
  //         try {
  //           // Verify payment on server and create booking
  //           const verifyRes = await fetch("/api/razorpay/verify", {
  //             method: "POST",
  //             headers: { "Content-Type": "application/json" },
  //             body: JSON.stringify({
  //               razorpay_order_id: response.razorpay_order_id,
  //               razorpay_payment_id: response.razorpay_payment_id,
  //               razorpay_signature: response.razorpay_signature,
  //               booking: bookingPayload,
  //             }),
  //           })

  //           if (!verifyRes.ok) {
  //             const err = await verifyRes.json().catch(() => ({}))
  //             throw new Error(err?.message || "Payment verification failed")
  //           }

  //           // Success: route to a confirmation or summary screen
  //           router.push("/checkout?status=success")
  //         } catch (e) {
  //           console.error("[v0] verify error:",message)
  //           router.push("/checkout?status=failed")
  //         } finally {
  //           setIsLoading(false)
  //         }
  //       },
  //       prefill: {
  //         // Provide if available
  //         name: "",
  //         email: "",
  //         contact: "",
  //       },
  //       notes: {
  //         property: propertyName,
  //         nights: String(nights),
  //       },
  //       theme: {
  //         color: "#000000",
  //       },
  //     }

  //     const rzp = new window.Razorpay(options)
  //     rzp.on("payment.failed", () => {
  //       setIsLoading(false)
  //     })
  //     rzp.open()
  //   } catch (error) {
  //     console.error("[v0] booking error:",message)
  //     setIsLoading(false)
  //   }
  // }

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
                        {guestCounts?.adults} Guest | {guestCounts?.children}{" "}
                        children
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
