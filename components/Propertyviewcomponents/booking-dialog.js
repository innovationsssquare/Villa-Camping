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
  clearSelectedTents,
  clearSelectedCottages,
} from "@/Redux/Slices/bookingSlice";
import { calculateBookingPrice } from "@/lib/bookingUtils";
import { X } from "lucide-react";
import TentSelectionDrawer from "../Tentscreen/tent-selection-drawer";
import { calculateCampingTentTotal } from "@/lib/calculateTentBasePrice";
import { addToast } from "@heroui/react";
import { Getcampingavability } from "../../lib/API/category/Camping/Camping";
import { Getcottageavability } from "../../lib/API/category/Cottage/Cottage";
import CottageSelectionDrawer from "../Cottagescreen/cottage-selection-drawer";
import { calculateCottageTotal } from "@/lib/calculateCottageBasePrice";

export default function BookingDialog({
  isOpen,
  Setopen,
  onClose,
  propertyName,
  price,
  originalPrice,
  propertyId,
  ownerId,
  propertyType,
  tents,
  cottages,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [preBookMeals, setPreBookMeals] = useState(false);
  const [isCouponsDrawerOpen, setIsCouponsDrawerOpen] = useState(false);
  const [isGuestDrawerOpen, setIsGuestDrawerOpen] = useState(false);
  const [isTentDrawerOpen, setIsTentDrawerOpen] = useState(false);
  const [isCottageDrawerOpen, setIsCottageDrawerOpen] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState("checkin");

  const dispatch = useDispatch();
  const booking = useSelector((state) => state.booking);
  const selectedGuest = booking?.selectedGuest;
  const checkinISO = booking?.checkin;
  const checkoutISO = booking?.checkout;
  const router = useRouter();
  const appliedCoupon = useSelector((state) => state.booking.appliedCoupon);
  const reduxSelectedTents = useSelector(
    (state) => state.booking.selectedTents
  );
  const reduxSelectedCottages = useSelector(
    (state) => state.booking.selectedCottages
  );

  const dayTents = useSelector(
    (state) => state.camping.dayDetails?.tents || []
  );

  const dayCottages = useSelector(
    (state) => state.cottage.dayDetails?.cottages || []
  );

  // Convert ISO strings to Date for UI
  const checkInDate = checkinISO ? new Date(checkinISO) : new Date();
  const checkOutDate = checkoutISO
    ? new Date(checkoutISO)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);
  const [selectedTents, setSelectedTents] = useState({});
  const [tentError, setTentError] = useState("");

  const [selectedCottages, setSelectedCottages] = useState({});

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

  let baseAmountForCoupon = 0;
  let nightsForCoupon = nights;

  if (propertyType === "Camping") {
    baseAmountForCoupon = calculateCampingTentTotal(
      reduxSelectedTents,
      dayTents,
      checkinISO,
      checkoutISO
    );
    nightsForCoupon = 1;
  } else if (propertyType === "Cottage") {
    baseAmountForCoupon = calculateCottageTotal(
      reduxSelectedCottages,
      dayCottages,
      checkinISO,
      checkoutISO
    );
    nightsForCoupon = 1;
  } else {
    baseAmountForCoupon = price;
  }

  const { discountAmount, finalTotal } = calculateBookingPrice(
    baseAmountForCoupon,
    nightsForCoupon,
    appliedCoupon
  );

  const validateTents = () => {
    const totalSelected = Object.values(reduxSelectedTents).reduce(
      (s, q) => s + q,
      0
    );

    if (totalSelected === 0) {
      setTentError("Please select at least one tent");
      return false;
    }

    const totalCapacity = Object.entries(reduxSelectedTents).reduce(
      (sum, [tentId, qty]) => {
        const tent = tents.find((t) => t._id === tentId);
        return sum + (tent?.maxCapacity || 0) * qty;
      },
      0
    );

    if (totalGuests > totalCapacity) {
      setTentError(
        `Selected tents allow ${totalCapacity} guests, but you selected ${totalGuests}`
      );
      return false;
    }

    return true;
  };

  const validateCottages = () => {
    const totalSelected = Object.values(reduxSelectedCottages || {}).reduce(
      (s, c) => s + (c?.quantity || 0),
      0
    );

    if (totalSelected === 0) {
      setTentError("Please select at least one cottage");
      return false;
    }

    const totalCapacity = Object.entries(reduxSelectedCottages || {}).reduce(
      (sum, [cottageType, data]) => {
        const cottage = cottages.find((c) => c.cottageType === cottageType);
        return sum + (cottage?.maxCapacity || 0) * (data?.quantity || 0);
      },
      0
    );

    if (totalGuests > totalCapacity) {
      setTentError(
        `Selected cottages allow ${totalCapacity} guests, but you selected ${totalGuests}`
      );
      return false;
    }

    return true;
  };

  const buildRequestedCottagesByType = () => {
    const result = {};

    Object.entries(reduxSelectedCottages || {}).forEach(([type, data]) => {
      if (!data?.quantity) return;
      result[type] = data.quantity;
    });

    console.log("requestedCottagesByType", result);
    return result;
  };

  const buildRequestedTentsByType = () => {
    const result = {};

    Object.entries(reduxSelectedTents || {}).forEach(([type, data]) => {
      if (!data?.quantity) return;
      result[type] = data.quantity;
    });

    console.log("requestedTentsByType", result);
    return result;
  };

  // const handleBooking = async () => {
  //   if (propertyType === "Camping") {
  //     if (!validateTents()) return;

  //     const requestedTents = buildRequestedTentsByType();
  //     setIsLoading(true);

  //     const availabilityRes = await Getcampingavability({
  //       propertyId,
  //       checkIn: checkinISO,
  //       checkOut: checkoutISO,
  //       tents: requestedTents,
  //     });
  //     if (!availabilityRes?.success || availabilityRes?.available === false) {
  //       setIsLoading(false);
  //       setTentError(
  //         availabilityRes?.message ||
  //           "Selected tents are not available for all dates"
  //       );
  //       return;
  //     }
  //   }

  //   setIsLoading(false);
  //   router.push("/checkout");
  // };

  const handleBooking = async () => {
    setTentError("");

    // 🏕 CAMPING
    if (propertyType === "Camping") {
      if (!validateTents()) return;

      const requestedTents = buildRequestedTentsByType();
      setIsLoading(true);

      const availabilityRes = await Getcampingavability({
        propertyId,
        checkIn: checkinISO,
        checkOut: checkoutISO,
        tents: requestedTents,
      });

      if (!availabilityRes?.success || availabilityRes?.available === false) {
        setIsLoading(false);
        setTentError(
          availabilityRes?.message ||
            "Selected tents are not available for all dates"
        );
        return;
      }
    }

    // 🏡 COTTAGE
    if (propertyType === "Cottage") {
      if (!validateCottages()) return;

      const requestedCottages = buildRequestedCottagesByType();
      setIsLoading(true);

      const availabilityRes = await Getcottageavability({
        propertyId,
        checkIn: checkinISO,
        checkOut: checkoutISO,
        cottages: requestedCottages,
      });

      if (!availabilityRes?.success || availabilityRes?.available === false) {
        setIsLoading(false);
        setTentError(
          availabilityRes?.message ||
            "Selected cottages are not available for all dates"
        );
        return;
      }
    }

    setIsLoading(false);
    router.push("/checkout");
  };

  const totalTentQty = Object.values(reduxSelectedTents || {}).reduce(
    (sum, t) => sum + (t?.quantity || 0),
    0
  );
  const totalCottageQty = Object.values(reduxSelectedCottages || {}).reduce(
    (sum, t) => sum + (t?.quantity || 0),
    0
  );

  const isProceedDisabled =
    isLoading ||
    finalTotal <= 0 ||
    (propertyType === "Camping" && totalTentQty === 0) ||
    (propertyType === "Cottage" && totalCottageQty === 0);

  const handleApplyCoupon = (coupon) => {
    if (subtotalForCoupon <= 0) {
      addToast?.({
        title: "Coupon applied failed!",
        description: `Please select dates/tents before applying a coupon`,
        color: "success",
      });
      return;
    }

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
    dispatch(clearSelectedTents());
    dispatch(clearSelectedCottages());
    setTentError("");
    dispatch(removeCoupon());
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

  const handleTentQtyChange = (tentId, qty, available) => {
    if (qty < 0 || qty > available) return;

    setSelectedTents((prev) => ({
      ...prev,
      [tentId]: qty,
    }));

    if (tentError) setTentError("");
  };

  function formatRupee(amount) {
    if (amount == null || Number.isNaN(Number(amount))) return "₹0";
    // no decimal places - change maximumFractionDigits if needed
    const formatted = new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Number(amount));
    return `₹${formatted}`;
  }

  const handleTentSelectionChange = (newSelectedTents) => {
    setSelectedTents(newSelectedTents);
  };

  const handleCottageSelectionChange = (newSelectedCottages) => {
    setSelectedCottages(newSelectedCottages);
  };

  const totalSelectedTents = Object.values(reduxSelectedTents || {}).reduce(
    (sum, t) => sum + (t.quantity || 0),
    0
  );

  const totalSelectedCottages = Object.values(
    reduxSelectedCottages || {}
  ).reduce((sum, t) => sum + (t.quantity || 0), 0);

  let subtotalForCoupon = 0;

  if (propertyType === "Camping") {
    subtotalForCoupon = calculateCampingTentTotal(
      reduxSelectedTents,
      dayTents,
      checkinISO,
      checkoutISO
    );
  } else if (propertyType === "Cottages") {
    subtotalForCoupon = calculateCottageTotal(
      reduxSelectedCottages,
      dayCottages,
      checkinISO,
      checkoutISO
    );
  } else {
    subtotalForCoupon = price * nights;
  }

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
                      {formatRupee(price)}
                    </span>
                    {originalPrice && (
                      <span className="text-gray-500 line-through">
                        {formatRupee(originalPrice)}
                      </span>
                    )}
                  </div>
                  {tents?.length > 0 && tents ? (
                    <p className="text-gray-600 text-sm">Starts from</p>
                  ) : (
                    <p className="text-gray-600 text-sm">Per night</p>
                  )}
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
                        {guestCounts.adults}{" "}
                        {guestCounts.adults === 1 ? "Guest" : "Guests"} |{" "}
                        {guestCounts.children} Children
                      </span>
                      <span className="font-semibold text-sm text-black">
                        {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
                      </span>
                      <FaChevronDown size={12} className=" text-black" />
                    </div>
                  </Button>
                </div>

                {tents?.length > 0 && tents && (
                  <div className="px-2">
                    <label className="text-sm text-gray-500 mb-1 block">
                      Tents
                    </label>
                    <Button
                      size=""
                      onPress={() => setIsTentDrawerOpen(true)}
                      className="w-full border bg-white rounded-lg p-3 border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-sm text-black">
                          {totalSelectedTents === 0
                            ? "Select Tents"
                            : `${totalSelectedTents} ${
                                totalSelectedTents === 1 ? "Tent" : "Tents"
                              } Selected`}
                        </span>
                        <FaChevronDown size={12} className="text-black" />
                      </div>
                    </Button>
                  </div>
                )}
                {cottages?.length > 0 && cottages && (
                  <div className="px-2">
                    <label className="text-sm text-gray-500 mb-1 block">
                      Cottages
                    </label>
                    <Button
                      size=""
                      onPress={() => setIsCottageDrawerOpen(true)}
                      className="w-full border bg-white rounded-lg p-3 border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-sm text-black">
                          {totalSelectedCottages === 0
                            ? "Select Cottages"
                            : `${totalSelectedCottages} ${
                                totalSelectedCottages === 1
                                  ? "Cottage"
                                  : "Cottages"
                              } Selected`}
                        </span>
                        <FaChevronDown size={12} className="text-black" />
                      </div>
                    </Button>
                  </div>
                )}

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
                {tentError}
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
                  disabled={isProceedDisabled}
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
        propertyId={propertyId}
        propertyType={propertyType}
        subtotal={subtotalForCoupon}
        checkIn={checkinISO}
        checkOut={checkoutISO}
        nights={nights}
      />

      <GuestSelectionDrawer
        isOpen={isGuestDrawerOpen}
        onClose={() => setIsGuestDrawerOpen(false)}
        guestCounts={guestCounts}
        onGuestCountsChange={handleGuestCountsChange}
      />

      <TentSelectionDrawer
        isOpen={isTentDrawerOpen}
        onClose={() => setIsTentDrawerOpen(false)}
        tents={tents}
        selectedTents={selectedTents}
        onTentSelectionChange={handleTentSelectionChange}
        totalGuests={totalGuests}
        id={propertyId}
        dateStr={checkInDate}
      />

      <CottageSelectionDrawer
        isOpen={isCottageDrawerOpen}
        onClose={() => setIsCottageDrawerOpen(false)}
        cottages={cottages}
        selectedCottages={selectedCottages}
        onCottageSelectionChange={handleCottageSelectionChange}
        totalGuests={totalGuests}
        id={propertyId}
        dateStr={checkInDate}
      />
    </>
  );
}
