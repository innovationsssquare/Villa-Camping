"use client";

import { useState, useEffect, useRef } from "react";
import {
  CalendarIcon,
  Users,
  Home,
  Tent,
  ChevronDown,
  ChevronRight,
  Star,
  Gift,
  Tag,
  Receipt,
  Minus,
  Plus,
  Sparkles,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DualDatePicker } from "../../Navbarcomponents/dual-date-picker";
import { GuestSelector } from "../../Navbarcomponents/guest-selector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import confetti from "canvas-confetti";
import { useDispatch, useSelector } from "react-redux";
import {
  setCheckin,
  setCheckout,
  updateGuestCount,
  setAppliedCoupon,
  removeCoupon,
  setPropertyId,
  setcategoryId,
  setOwnerId,
  setPropertyType,
} from "@/Redux/Slices/bookingSlice";
import { useCamping } from "@/lib/context/CampingContext";
import { calculateBookingPrice } from "@/lib/bookingUtils";
import {
  calculateBasePriceForRange,
  useHolidayDates,
} from "@/lib/pricingUtils";
import { calculateCampingTentTotal } from "@/lib/calculateTentBasePrice";
import { Getallcouponbypropertyid } from "@/lib/API/Coupon/Coupon";
import TentSelectionDrawer from "@/components/Tentscreen/tent-selection-drawer";
import CouponsDrawer from "../coupons-drawer";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuthModal } from "@/context/AuthModalContext";

export default function StickyBookingWidget() {
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [guestPopoverOpen, setGuestPopoverOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isCouponsDrawerOpen, setIsCouponsDrawerOpen] = useState(false);
  const [isTentDrawerOpen, setIsTentDrawerOpen] = useState(false);
  const [couponsList, setCouponsList] = useState([]);

  const camping = useCamping();
  const router = useRouter();
  const dispatch = useDispatch();
  const { openAuthModal } = useAuthModal();

  const { checkin, checkout, selectedGuest, appliedCoupon, selectedTents } =
    useSelector((state) => state.booking);

  const reduxSelectedTents = selectedTents || {};
  const dayTents = useSelector((state) => state.camping.dayDetails?.tents || []);

  const [widgetFocusedSide, setWidgetFocusedSide] = useState(() => {
    return checkin && !checkout ? "checkout" : "checkin";
  });

  useEffect(() => {
    if (checkin && !checkout) {
      setWidgetFocusedSide("checkout");
    } else if (!checkin) {
      setWidgetFocusedSide("checkin");
    }
  }, [checkin, checkout]);

  const areDatesSelected = Boolean(checkin && checkout);
  const checkInDate = checkin ? new Date(checkin) : null;
  const checkOutDate = checkout ? new Date(checkout) : null;

  const msPerDay = 1000 * 60 * 60 * 24;
  const nights = checkInDate && checkOutDate
    ? Math.max(1, Math.round((+checkOutDate - +checkInDate) / msPerDay))
    : 1;

  // Fetch coupons
  useEffect(() => {
    let isMounted = true;
    async function fetchCoupons() {
      if (!camping?._id) return;
      try {
        const res = await Getallcouponbypropertyid(camping._id);
        if (isMounted && res && res.data) {
          setCouponsList(res.data);
        }
      } catch (err) {
        console.warn("Failed to fetch coupons:", err);
      }
    }
    fetchCoupons();
    return () => {
      isMounted = false;
    };
  }, [camping?._id]);

  // Guest counts
  const totalGuests = (selectedGuest?.adults || 1) + (selectedGuest?.childrenn || 0);

  // Tents count and capacity calculation
  const totalSelectedTentsCount = Object.values(reduxSelectedTents).reduce(
    (sum, t) => sum + (t?.quantity || 0),
    0
  );

  const totalSelectedTentCapacity = Object.values(reduxSelectedTents).reduce(
    (sum, t) => sum + (t?.maxCapacity || 2) * (t?.quantity || 0),
    0
  );

  // Base pricing calculation
  let baseAmount = 0;
  if (totalSelectedTentsCount > 0) {
    baseAmount = calculateCampingTentTotal(
      reduxSelectedTents,
      dayTents,
      checkin,
      checkout
    );
  } else {
    // Default base price per night
    const perNight = Number(
      camping?.pricing?.weekdayPrice ||
      camping?.basePricePerNight ||
      1200
    );
    baseAmount = perNight * nights;
  }

  const { discountAmount, finalTotal, taxAmount } = calculateBookingPrice(
    baseAmount,
    1,
    appliedCoupon
  );

  // Coupon handlers
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError("");

    const found = couponsList.find(
      (c) => c.code.toLowerCase() === couponCode.trim().toLowerCase()
    );

    if (!found) {
      setCouponError("Invalid coupon code.");
      setIsApplyingCoupon(false);
      return;
    }

    if (found.minAmount && baseAmount < found.minAmount) {
      setCouponError(`Min booking ₹${found.minAmount.toLocaleString()} required`);
      setIsApplyingCoupon(false);
      return;
    }

    dispatch(setAppliedCoupon(found));
    setCouponCode("");
    setIsApplyingCoupon(false);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff6900", "#10b981", "#3b82f6", "#f59e0b"],
    });
  };

  const handleApplyCouponFromDrawer = (coupon) => {
    dispatch(setAppliedCoupon(coupon));
    setIsCouponsDrawerOpen(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff6900", "#10b981", "#3b82f6", "#f59e0b"],
    });
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponError("");
  };

  const handleReserve = () => {
    dispatch(setPropertyId(camping?._id));
    dispatch(setcategoryId(camping?.category));
    dispatch(setOwnerId(camping?.owner));
    dispatch(setPropertyType("Camping"));

    const token = Cookies.get("token");
    if (!token) {
      openAuthModal({ returnUrl: "/checkout" });
      return;
    }

    router.push("/checkout");
  };

  return (
    <>
      <div id="booking-widget" className="sticky top-28 z-30">
        <Card className="bg-white/95 backdrop-blur-xl border border-neutral-200/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
          <CardContent className="p-6 space-y-5">
            {/* Top Price Header & Rating */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-gray-900 tracking-tight">
                    ₹{baseAmount.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    ₹{(baseAmount + 2500).toLocaleString()}
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-medium block mt-0.5">
                  {areDatesSelected
                    ? `Total for ${nights} ${nights === 1 ? "night" : "nights"}`
                    : "Starts from / night + taxes"}
                </span>
              </div>

              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-gray-900">
                  {camping?.averageRating || "4.8"}
                </span>
              </div>
            </div>

            {/* Input Picker Grid (Dates, Guests & Tents) */}
            <div className="rounded-2xl border border-neutral-300 divide-y divide-neutral-200 overflow-hidden bg-white">
              {/* Check-in / Check-out Row */}
              <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full grid grid-cols-2 text-left hover:bg-neutral-50/80 transition-colors p-3 cursor-pointer"
                  >
                    <div className="border-r border-neutral-200 pr-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Check-in
                      </span>
                      <span className="text-xs font-bold text-gray-900 truncate block mt-0.5">
                        {checkInDate ? format(checkInDate, "MMM dd, yyyy") : "Add date"}
                      </span>
                    </div>
                    <div className="pl-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Check-out
                      </span>
                      <span className="text-xs font-bold text-gray-900 truncate block mt-0.5">
                        {checkOutDate ? format(checkOutDate, "MMM dd, yyyy") : "Add date"}
                      </span>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 border-0 bg-transparent shadow-none"
                  align="center"
                  sideOffset={8}
                >
                  <DualDatePicker
                    checkinDate={checkin}
                    checkoutDate={checkout}
                    onCheckinSelect={(date) => {
                      dispatch(setCheckin(date));
                      dispatch(setCheckout(null));
                      setWidgetFocusedSide("checkout");
                    }}
                    onCheckoutSelect={(date) => {
                      dispatch(setCheckout(date));
                    }}
                    minDate={new Date()}
                    isMobile={false}
                    timezone="Asia/Kolkata"
                    onClose={() => setDatePopoverOpen(false)}
                    focusedSide={widgetFocusedSide}
                    setFocusedSide={setWidgetFocusedSide}
                  />
                </PopoverContent>
              </Popover>

              {/* Guests Row */}
              <Popover open={guestPopoverOpen} onOpenChange={setGuestPopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-neutral-50/80 transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Guests
                      </span>
                      <span className="text-xs font-bold text-gray-900 block mt-0.5">
                        {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-80 p-0 border-0 bg-transparent shadow-none"
                  align="end"
                  sideOffset={8}
                >
                  <GuestSelector
                    adults={selectedGuest?.adults || 1}
                    childrenn={selectedGuest?.childrenn || 0}
                    infants={selectedGuest?.infants || 0}
                    pets={selectedGuest?.pets || 0}
                    onGuestChange={(type, value) => {
                      dispatch(updateGuestCount({ type, value }));
                    }}
                    onClose={() => setGuestPopoverOpen(false)}
                    isMobile={false}
                  />
                </PopoverContent>
              </Popover>

              {/* Tents Unit Selector Row */}
              <button
                type="button"
                onClick={() => setIsTentDrawerOpen(true)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-neutral-50/80 transition-colors cursor-pointer"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#ff6900] uppercase tracking-wider block">
                    Tents Selection
                  </span>
                  <span className="text-xs font-bold text-gray-900 block mt-0.5">
                    {totalSelectedTentsCount > 0
                      ? `${totalSelectedTentsCount} ${
                          totalSelectedTentsCount === 1 ? "Tent" : "Tents"
                        } (Fits up to ${totalSelectedTentCapacity} Guests)`
                      : "No Tents Selected • Tap to select"}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#ff6900] bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                  {totalSelectedTentsCount > 0 ? "Edit" : "Select"}
                </span>
              </button>
            </div>

            {/* Coupon Code Section */}
            <div>
              {appliedCoupon ? (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Percent className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-950 block">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-[11px] text-emerald-700">
                        ₹{discountAmount.toLocaleString()} saved!
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveCoupon}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-1.5 h-auto"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          if (couponError) setCouponError("");
                        }}
                        className="w-full pl-8 pr-3 py-2 text-xs font-semibold uppercase bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#ff6900]"
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim() || isApplyingCoupon}
                      className="bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold px-3.5 h-9"
                    >
                      {isApplyingCoupon ? "..." : "Apply"}
                    </Button>
                  </div>

                  {couponError && (
                    <p className="text-[11px] text-rose-600 font-medium px-1">
                      {couponError}
                    </p>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsCouponsDrawerOpen(true)}
                      className="text-[11px] font-bold text-[#ff6900] hover:text-[#e05d00] flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>View available offers</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-2 pt-3 border-t border-neutral-150 text-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span>
                  {totalSelectedTentsCount > 0
                    ? `Tents subtotal (${totalSelectedTentsCount} tents)`
                    : "Campsite base rate"}
                </span>
                <span className="font-semibold text-gray-900">
                  ₹{baseAmount.toLocaleString()}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-gray-600">
                <span>Taxes & GST (18%)</span>
                <span className="font-semibold text-gray-900">
                  ₹{taxAmount.toLocaleString()}
                </span>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                <div>
                  <span className="text-sm font-extrabold text-gray-900 block">
                    Total
                  </span>
                  <span className="text-[10px] text-gray-500">Includes all taxes</span>
                </div>
                <span className="text-lg font-black text-gray-900">
                  ₹{finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={handleReserve}
              className="w-full bg-[#ff6900] hover:bg-[#e05d00] text-white py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
            >
              {!areDatesSelected ? "Select Dates & Tents" : "Reserve Now"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tents Selection Drawer */}
      <TentSelectionDrawer
        isOpen={isTentDrawerOpen}
        onClose={() => setIsTentDrawerOpen(false)}
        tents={camping?.tents || []}
        selectedTents={reduxSelectedTents}
        onTentSelectionChange={() => {}}
        totalGuests={totalGuests}
        id={camping?._id}
        dateStr={checkInDate}
      />

      {/* Coupons Drawer */}
      <CouponsDrawer
        isOpen={isCouponsDrawerOpen}
        onClose={() => setIsCouponsDrawerOpen(false)}
        onApplyCoupon={handleApplyCouponFromDrawer}
        appliedCoupon={appliedCoupon}
        propertyId={camping?._id}
        propertyType="Camping"
        subtotal={baseAmount}
        checkIn={checkin}
        checkOut={checkout}
        nights={nights}
      />
    </>
  );
}
