"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import TentSelectionModal from "./tent-selection-modal";
import CottageSelectionModal from "./cottage-selection-modal";
import RoomSelectionModal from "./room-selection-modal";
import { calculateCottageTotal } from "@/lib/calculateCottageBasePrice";
import { calculateHotelTotal } from "@/lib/calculateHotelBasePrice";
import {
  CalendarIcon,
  Users,
  Home,
  ChevronDown,
  ChevronRight,
  Star,
  Gift,
  Tag,
  Receipt,
  Minus,
  Plus,
  Tent,
  Trees,
  Bed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DualDatePicker } from "../Navbarcomponents/dual-date-picker";
import { GuestSelector } from "../Navbarcomponents/guest-selector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import confetti from "canvas-confetti";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateRange } from "react-day-picker";
import { useDispatch, useSelector } from "react-redux";
import {
  setCheckin,
  setCheckout,
  setSelectedGuest,
  updateGuestCount,
  setAppliedCoupon,
  removeCoupon,
  setPropertyId,
  setcategoryId,
  setOwnerId,
  setPropertyType,
} from "@/Redux/Slices/bookingSlice";
import { useVilla } from "@/lib/context/VillaContext";
import { calculateBookingPrice } from "@/lib/bookingUtils";
import {
  calculateBasePriceForRange,
  useHolidayDates,
  calculateNightBreakdown,
} from "@/lib/pricingUtils";
import { Getallcouponbypropertyid, Applycoupon } from "@/lib/API/Coupon/Coupon";
import { getDeviceId } from "@/lib/deviceId";
import { Checkvillaavailability } from "@/lib/API/category/Villa/Villa";
import { BaseUrl } from "@/lib/API/Baseurl";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StickyBookingWidget() {
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [availabilityChecking, setAvailabilityChecking] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const villa = useVilla();
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    checkin,
    checkout,
    selectedGuest,
    appliedCoupon,
    selectedTents: reduxSelectedTents,
    selectedCottages: reduxSelectedCottages,
    selectedRooms: reduxSelectedRooms,
  } = useSelector((state) => state.booking);
  const [tentModalOpen, setTentModalOpen] = useState(false);
  const [cottageModalOpen, setCottageModalOpen] = useState(false);
  const [roomModalOpen, setRoomModalOpen] = useState(false);

  const isCamping = Boolean(villa?.tents && villa.tents.length > 0);
  const isCottage = Boolean(villa?.cottages && villa.cottages.length > 0);
  const isHotel = Boolean(villa?.rooms && villa.rooms.length > 0);

  const dayCottages = useSelector(
    (state) =>
      state.cottage?.dayDetails?.data?.cottages ||
      state.cottage?.dayDetails?.data?.tents ||
      state.cottage?.dayDetails?.cottages ||
      state.cottage?.dayDetails?.tents ||
      []
  );
  const dayRooms = useSelector(
    (state) =>
      state.hotel?.dayDetails?.data?.rooms ||
      state.hotel?.dayDetails?.data?.tents ||
      state.hotel?.dayDetails?.rooms ||
      state.hotel?.dayDetails?.tents ||
      []
  );

  const totalSelectedTentsCount = Object.values(reduxSelectedTents || {}).reduce(
    (s, t) => s + (t.quantity || 0),
    0
  );
  const totalSelectedTentGuests = Object.values(reduxSelectedTents || {}).reduce(
    (s, t) => s + (t.maxCapacity || 2) * (t.quantity || 0),
    0
  );

  const totalSelectedCottagesCount = Object.values(reduxSelectedCottages || {}).reduce(
    (s, c) => s + (c.quantity || 0),
    0
  );
  const totalSelectedCottageGuests = Object.values(reduxSelectedCottages || {}).reduce(
    (s, c) => s + (c.maxCapacity || 2) * (c.quantity || 0),
    0
  );

  const totalSelectedRoomsCount = Object.values(reduxSelectedRooms || {}).reduce(
    (s, r) => s + (r.quantity || 0),
    0
  );
  const totalSelectedRoomGuests = Object.values(reduxSelectedRooms || {}).reduce(
    (s, r) => s + (r.maxCapacity || 2) * (r.quantity || 0),
    0
  );

  const lowestTentPrice = useMemo(() => {
    if (!Array.isArray(villa?.tents) || villa.tents.length === 0) return 1200;
    return Math.min(
      ...villa.tents.map(
        (t) => t.pricing?.weekdayPrice || t.pricing?.weekendPrice || 1200
      )
    );
  }, [villa?.tents]);

  const lowestCottagePrice = useMemo(() => {
    if (!Array.isArray(villa?.cottages) || villa.cottages.length === 0) return 2000;
    return Math.min(
      ...villa.cottages.map(
        (c) => c.pricing?.weekdayPrice || c.pricing?.weekendPrice || 2000
      )
    );
  }, [villa?.cottages]);

  const lowestRoomPrice = useMemo(() => {
    if (!Array.isArray(villa?.rooms) || villa.rooms.length === 0) return 1500;
    return Math.min(
      ...villa.rooms.map(
        (r) => r.pricing?.weekdayPrice || r.pricing?.weekendPrice || 1500
      )
    );
  }, [villa?.rooms]);

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

  const holidayDates = useHolidayDates();

  const areDatesSelected = Boolean(checkin && checkout);
  const checkInDate = checkin ? new Date(checkin) : null;
  const checkOutDate = checkout ? new Date(checkout) : null;

  const msPerDay = 1000 * 60 * 60 * 24;
  const nights = (checkInDate && checkOutDate)
    ? Math.max(1, Math.round((+checkOutDate - +checkInDate) / msPerDay))
    : 1;

  const villaPricing = villa?.pricing ?? {};
  const basePricePerNight = isCamping
    ? totalSelectedTentsCount > 0
      ? Object.values(reduxSelectedTents).reduce(
          (sum, t) => sum + (t.quantity || 0) * (t.weekdayPrice || lowestTentPrice),
          0
        )
      : lowestTentPrice
    : isCottage
    ? totalSelectedCottagesCount > 0
      ? Object.values(reduxSelectedCottages).reduce(
          (sum, c) => sum + (c.quantity || 0) * (c.weekdayPrice || lowestCottagePrice),
          0
        )
      : lowestCottagePrice
    : isHotel
    ? totalSelectedRoomsCount > 0
      ? Object.values(reduxSelectedRooms).reduce(
          (sum, r) => sum + (r.quantity || 0) * (r.weekdayPrice || lowestRoomPrice),
          0
        )
      : lowestRoomPrice
    : Number(villa?.basePricePerNight) ||
      Number(villaPricing?.weekdayPrice) ||
      Number(villaPricing?.weekendPrice) ||
      0;

  // Compute the base amount using range pricing if dates selected, else 1-night base price
  let baseAmount = 0;
  if (isCamping) {
    baseAmount = areDatesSelected && totalSelectedTentsCount > 0
      ? Object.values(reduxSelectedTents).reduce(
          (sum, t) => sum + (t.quantity || 0) * (t.weekdayPrice || lowestTentPrice) * nights,
          0
        )
      : basePricePerNight * (areDatesSelected ? nights : 1);
  } else if (isCottage) {
    baseAmount = areDatesSelected && totalSelectedCottagesCount > 0
      ? calculateCottageTotal(
          reduxSelectedCottages,
          dayCottages,
          checkInDate?.toISOString(),
          checkOutDate?.toISOString()
        )
      : basePricePerNight * (areDatesSelected ? nights : 1);
  } else if (isHotel) {
    baseAmount = areDatesSelected && totalSelectedRoomsCount > 0
      ? calculateHotelTotal(
          reduxSelectedRooms,
          dayRooms,
          checkInDate?.toISOString(),
          checkOutDate?.toISOString()
        )
      : basePricePerNight * (areDatesSelected ? nights : 1);
  } else {
    baseAmount = areDatesSelected
      ? calculateBasePriceForRange(
          checkInDate?.toISOString(),
          checkOutDate?.toISOString(),
          villaPricing,
          holidayDates
        )
      : basePricePerNight;
  }

  const nightBreakdown = areDatesSelected
    ? calculateNightBreakdown(
        checkInDate?.toISOString(),
        checkOutDate?.toISOString(),
        villaPricing,
        holidayDates
      )
    : [];

  // Pass base=1 night multiplier since baseAmount already totals all nights
  const { discountAmount, finalTotal, taxAmount } = calculateBookingPrice(
    baseAmount,
    1,
    appliedCoupon
  );

  const totalGuests = (selectedGuest?.adults || 1) + (selectedGuest?.childrenn || 0);
  const maxCapacity = isCamping
    ? totalSelectedTentsCount > 0
      ? totalSelectedTentGuests
      : Number(villa?.maxCapacity || 20)
    : isCottage
    ? totalSelectedCottagesCount > 0
      ? totalSelectedCottageGuests
      : Number(villa?.maxCapacity || 20)
    : isHotel
    ? totalSelectedRoomsCount > 0
      ? totalSelectedRoomGuests
      : Number(villa?.maxCapacity || 20)
    : Number(villa?.maxCapacity || 10);

  const isSubtypeProperty = isCamping || isCottage || isHotel;
  const isOverCapacity = !isSubtypeProperty && totalGuests > maxCapacity;

  const widgetRef = useRef(null);
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [canScroll, setCanScroll] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = scrollContainerRef.current;
      setCanScroll(scrollHeight > clientHeight + 6);
      setHasScrolled(scrollTop > 15);
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, [areDatesSelected, appliedCoupon]);

  const [couponsList, setCouponsList] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadCoupons() {
      try {
        let res = null;
        if (villa?._id) {
          res = await Getallcouponbypropertyid(villa._id);
        }
        if (isMounted && res?.data?.coupons?.length) {
          const formatted = res.data.coupons
            .filter((c) => c.isActive !== false)
            .map((c) => ({
              code: c.code,
              title: c.title || c.code,
              description: c.description || "",
              discount: c.discount?.amount ?? c.discountValue ?? c.discount,
              type: c.discount?.type || c.discountType || "percentage",
              maxDiscount: c.maxDiscount || Infinity,
              validUntil: c.validTill
                ? new Date(c.validTill).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Valid",
              couponId: c._id,
            }));
          setCouponsList(formatted);
        } else if (isMounted) {
          setCouponsList([]);
        }
      } catch (err) {
        console.warn("[sticky-booking-widget] Error loading backend coupons:", err);
        if (isMounted) setCouponsList([]);
      }
    }
    loadCoupons();
    return () => {
      isMounted = false;
    };
  }, [villa?._id]);

  const applyCoupon = async (codeOrObj) => {
    const rawCode =
      typeof codeOrObj === "string" ? codeOrObj : codeOrObj?.code || "";
    if (!rawCode.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError("");

    try {
      const deviceId = await getDeviceId();
      const userId =
        typeof window !== "undefined"
          ? localStorage.getItem("thevilla_user_id")
          : null;

      const res = await Applycoupon({
        couponCode: rawCode.trim().toUpperCase(),
        orderValue: baseAmount,
        userId,
        deviceId,
        propertyId: villa?._id,
        propertyType: isCamping ? "camping" : isCottage ? "cottage" : isHotel ? "hotel" : "villa",
      });

      if (res?.status === "success" && res?.data?.coupon) {
        const backendCoupon = res.data.coupon;
        dispatch(
          setAppliedCoupon({
            ...backendCoupon,
            code: backendCoupon.code,
            discountAmount: res.data.discountAmount,
            discountType: backendCoupon.discount?.type || "percentage",
            discountValue: backendCoupon.discount?.amount || 0,
            maxDiscount: backendCoupon.maxDiscount || Infinity,
          })
        );
        setCouponCode("");
        setIsApplyingCoupon(false);
      } else {
        setCouponError(res?.message || "Invalid coupon code");
        setIsApplyingCoupon(false);
        return;
      }
    } catch (err) {
      setCouponError("Failed to apply coupon");
      setIsApplyingCoupon(false);
      return;
    }

    const couponInputElement =
      document.querySelector("[data-coupon-input]") ||
      document.querySelector("[data-main-coupon-input]");
    let targetElement = { x: 0.5, y: 0.4 };

    if (couponInputElement) {
      const rect = couponInputElement.getBoundingClientRect();
      targetElement = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      };
    }

    confetti({
      particleCount: 120,
      spread: 80,
      origin: targetElement,
      colors: [
        "#ff6b6b",
        "#4ecdc4",
        "#45b7d1",
        "#96ceb4",
        "#feca57",
        "#ff9ff3",
        "#54a0ff",
        "#5f27cd",
      ],
      shapes: ["circle", "square"],
      scalar: 1.2,
      drift: 0,
      gravity: 0.8,
      ticks: 250,
    });

    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: targetElement,
        colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#feca57", "#ff9ff3"],
        shapes: ["star"],
        scalar: 0.8,
      });
    }, 200);
  };

  const removeCouponHandler = () => {
    dispatch(removeCoupon());
    setCouponError("");
  };

  const applyCouponFromSheet = (coupon) => {
    dispatch(setAppliedCoupon(coupon)); // 🔥 Redux
    setCouponCode("");
    setIsApplyingCoupon(false);

    const sheetInputElement =
      document.querySelector("[data-coupon-input] input") ||
      document.querySelector("[data-sheet-content]");
    let targetElement = { x: 0.8, y: 0.3 };

    if (sheetInputElement) {
      const rect = sheetInputElement.getBoundingClientRect();
      targetElement = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      };
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: targetElement,
      colors: [
        "#ff6b6b",
        "#4ecdc4",
        "#45b7d1",
        "#96ceb4",
        "#feca57",
        "#ff9ff3",
        "#54a0ff",
        "#5f27cd",
      ],
      shapes: ["circle", "square"],
      scalar: 1.0,
    });
  };

  return (
    <div id="booking-widget" className="lg:sticky lg:top-[148px] z-20 w-full transition-all duration-300 scroll-mt-[155px]">
      <Card className="shadow-xl shadow-gray-200/50 border border-gray-150 bg-white/98 backdrop-blur-md rounded-2xl flex flex-col lg:max-h-[calc(100vh-10.5rem)] overflow-hidden">
        {/* Scrollable Upper Body with subtle custom scrollbar */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollability}
          className="relative flex-1 overflow-y-auto p-4 sm:p-4.5 space-y-3 scrollbar-thin [scrollbar-width:thin] [scrollbar-color:#e5e7eb_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300"
        >
          {/* Instant Confirmation Badge & Rating */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Instant Confirmation
            </span>
            <div className="flex items-center space-x-1 text-xs bg-neutral-50 px-2 py-0.5 rounded-full border border-neutral-200/80">
              <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span className="font-bold text-xs text-gray-900">{villa?.averageRating || "4.8"}</span>
              <span className="text-gray-400 text-[10px]">/5</span>
            </div>
          </div>

          {/* Pricing Header */}
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {isCamping && totalSelectedTentsCount === 0 && !areDatesSelected
                  ? `Starts from ₹${lowestTentPrice.toLocaleString("en-IN")}`
                  : isCottage && totalSelectedCottagesCount === 0 && !areDatesSelected
                  ? `Starts from ₹${lowestCottagePrice.toLocaleString("en-IN")}`
                  : isHotel && totalSelectedRoomsCount === 0 && !areDatesSelected
                  ? `Starts from ₹${lowestRoomPrice.toLocaleString("en-IN")}`
                  : `₹${(areDatesSelected ? finalTotal : basePricePerNight).toLocaleString("en-IN")}`}
              </span>
              <span className="text-gray-500 text-xs font-medium">
                {areDatesSelected
                  ? nights === 1
                    ? "(1 night · Incl. taxes)"
                    : `(${nights} nights · Incl. taxes)`
                  : isCamping
                  ? "/ tent / night"
                  : isCottage
                  ? "/ cottage / night"
                  : isHotel
                  ? "/ room / night"
                  : "Per Night + Taxes"}
              </span>
            </div>
            {isCamping && totalSelectedTentsCount === 0 && (
              <p className="text-[11px] text-[#ff6900] font-medium mt-0.5">
                Choose your tents & dates to calculate booking total
              </p>
            )}
            {isCottage && totalSelectedCottagesCount === 0 && (
              <p className="text-[11px] text-[#ff6900] font-medium mt-0.5">
                Choose your cottages & dates to calculate booking total
              </p>
            )}
            {isHotel && totalSelectedRoomsCount === 0 && (
              <p className="text-[11px] text-[#ff6900] font-medium mt-0.5">
                Choose your rooms & dates to calculate booking total
              </p>
            )}
            {!isSubtypeProperty && !areDatesSelected && (
              <p className="text-[11px] text-amber-600 font-medium mt-0.5">
                Select stay dates to calculate total stay price
              </p>
            )}
          </div>

          {/* Unified Compact Dates & Guests Selector (Airbnb Style) */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-2xs divide-y divide-gray-150">
            {/* If Camping, add Tent Accommodation Row */}
            {isCamping && (
              <div
                onClick={() => setTentModalOpen(true)}
                className={`p-2.5 sm:p-3 cursor-pointer transition-colors hover:bg-orange-50/50 ${
                  totalSelectedTentsCount === 0 ? "bg-orange-50/20" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                      Tents Accommodation {totalSelectedTentsCount === 0 && <span className="text-red-500">*</span>}
                    </span>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <Tent className="w-3.5 h-3.5 text-[#ff6900]" />
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        {totalSelectedTentsCount > 0
                          ? `${totalSelectedTentsCount} ${totalSelectedTentsCount === 1 ? "Tent" : "Tents"} (${totalSelectedTentGuests} Max Guests)`
                          : "Choose Tents to Reserve"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#ff6900] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                    {totalSelectedTentsCount > 0 ? "Change" : "Select"}
                  </span>
                </div>
              </div>
            )}

            {/* If Cottage, add Cottage Accommodation Row */}
            {isCottage && (
              <div
                onClick={() => setCottageModalOpen(true)}
                className={`p-2.5 sm:p-3 cursor-pointer transition-colors hover:bg-orange-50/50 ${
                  totalSelectedCottagesCount === 0 ? "bg-orange-50/20" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                      Cottage Accommodation {totalSelectedCottagesCount === 0 && <span className="text-red-500">*</span>}
                    </span>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <Trees className="w-3.5 h-3.5 text-[#ff6900]" />
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        {totalSelectedCottagesCount > 0
                          ? `${totalSelectedCottagesCount} ${totalSelectedCottagesCount === 1 ? "Cottage" : "Cottages"} (${totalSelectedCottageGuests} Max Guests)`
                          : "Choose Cottages to Reserve"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#ff6900] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                    {totalSelectedCottagesCount > 0 ? "Change" : "Select"}
                  </span>
                </div>
              </div>
            )}

            {/* If Hotel, add Room Accommodation Row */}
            {isHotel && (
              <div
                onClick={() => setRoomModalOpen(true)}
                className={`p-2.5 sm:p-3 cursor-pointer transition-colors hover:bg-orange-50/50 ${
                  totalSelectedRoomsCount === 0 ? "bg-orange-50/20" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                      Room Accommodation {totalSelectedRoomsCount === 0 && <span className="text-red-500">*</span>}
                    </span>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <Bed className="w-3.5 h-3.5 text-[#ff6900]" />
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        {totalSelectedRoomsCount > 0
                          ? `${totalSelectedRoomsCount} ${totalSelectedRoomsCount === 1 ? "Room" : "Rooms"} (${totalSelectedRoomGuests} Max Guests)`
                          : "Choose Rooms to Reserve"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#ff6900] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                    {totalSelectedRoomsCount > 0 ? "Change" : "Select"}
                  </span>
                </div>
              </div>
            )}

            {/* Top Row: Dates */}
            <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
              <PopoverTrigger asChild>
                <div
                  onClick={() => {
                    if (checkin && !checkout) {
                      setWidgetFocusedSide("checkout");
                    }
                  }}
                  className={`p-2.5 sm:p-3 cursor-pointer transition-colors hover:bg-neutral-50/80 ${
                    !areDatesSelected ? "bg-amber-50/30" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Dates {!areDatesSelected && <span className="text-red-500">*</span>}
                      </span>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-[#ff6900]" />
                        <span className="text-xs sm:text-sm font-semibold text-gray-900">
                          {checkin ? (
                            <>
                              {format(new Date(checkin), "MMM dd")}
                              {checkout ? (
                                <> → {format(new Date(checkout), "MMM dd, yyyy")}</>
                              ) : (
                                <span className="text-amber-600"> → Select check-out</span>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-500 font-normal">Add stay dates</span>
                          )}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 border-0 bg-transparent shadow-none z-50"
                align="end"
                sideOffset={8}
                collisionPadding={16}
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

            {/* Bottom Row: Guests */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="p-2.5 sm:p-3 cursor-pointer transition-colors hover:bg-neutral-50/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Guests
                      </span>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-[#ff6900]" />
                        <span className="text-xs sm:text-sm font-semibold text-gray-900">
                          {selectedGuest?.adults || 1} Adults, {selectedGuest?.childrenn || 0} Children
                          {selectedGuest?.pets > 0 ? `, ${selectedGuest.pets} Pet${selectedGuest.pets > 1 ? "s" : ""}` : ""}
                          {selectedGuest?.infants > 0 ? `, ${selectedGuest.infants} Inf.` : ""}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 border-0 bg-transparent shadow-none z-50"
                align="end"
              >
                <GuestSelector
                  adults={selectedGuest?.adults || 1}
                  childrenn={selectedGuest?.childrenn || 0}
                  infants={selectedGuest?.infants || 0}
                  pets={selectedGuest?.pets || 0}
                  onGuestChange={(type, value) => {
                    dispatch(updateGuestCount({ type, value }));
                  }}
                  isMobile={false}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Sleek, High-Converting Coupon Strip */}
          <div>
            {appliedCoupon ? (
              <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                <div className="flex items-center space-x-2 min-w-0">
                  <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-emerald-950 truncate">{appliedCoupon.code}</span>
                  <span className="text-emerald-700 font-semibold text-[11px]">
                    (-₹{discountAmount.toLocaleString("en-IN")} applied)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removeCouponHandler}
                  className="text-red-500 hover:text-red-700 font-semibold text-xs cursor-pointer ml-2"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-orange-50 to-amber-50/60 border border-orange-200/70 rounded-xl">
                <div className="flex items-center space-x-2 min-w-0">
                  <Gift className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                  <span className="text-xs font-semibold text-gray-800 truncate">Coupons & Offers</span>
                  {couponsList && couponsList.length > 0 && (
                    <span className="text-[10px] font-bold bg-[#ff6900]/10 text-[#ff6900] px-1.5 py-0.5 rounded-full">
                      {couponsList[0].type === "percentage"
                        ? `Up to ${couponsList[0].discount}% OFF`
                        : `Flat ₹${couponsList[0].discount} OFF`}
                    </span>
                  )}
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <button
                      type="button"
                      className="text-xs font-bold text-[#ff6900] hover:text-[#e05d00] flex items-center gap-0.5 cursor-pointer ml-2"
                    >
                      <span>View ({couponsList?.length || 0})</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-md p-0 bg-white">
                    <SheetHeader className="p-6 border-b border-gray-100">
                      <SheetTitle className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                        <Gift className="w-5 h-5 text-[#ff6900]" />
                        <span>Available Coupons</span>
                      </SheetTitle>
                    </SheetHeader>

                    <div className="p-6">
                      <div className="flex gap-2 mb-6">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="flex-1 uppercase font-semibold text-sm"
                        />
                        <Button
                          onClick={() => applyCoupon(couponCode)}
                          disabled={isApplyingCoupon || !couponCode.trim()}
                          className="bg-[#ff6900] hover:bg-[#e05d00] text-white font-bold px-5"
                        >
                          {isApplyingCoupon ? "Applying..." : "Apply"}
                        </Button>
                      </div>

                      {couponError && (
                        <div className="text-xs text-red-600 mb-4 p-2.5 bg-red-50 rounded-xl border border-red-200 flex items-center space-x-1.5">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{couponError}</span>
                        </div>
                      )}

                      <ScrollArea className="h-[calc(100vh-260px)] pr-2">
                        <div className="space-y-4">
                          <h4 className="font-bold text-sm text-gray-900">Coupons for you</h4>
                          <div className="space-y-3">
                            {couponsList && couponsList.length > 0 ? (
                              couponsList.map((coupon) => (
                                <Card
                                  key={coupon.code}
                                  className={`p-4 border transition-all duration-200 ${
                                    appliedCoupon?.code === coupon.code
                                      ? "border-emerald-300 bg-emerald-50/50 shadow-xs"
                                      : "border-gray-200 hover:border-orange-200 hover:bg-orange-50/20 shadow-xs"
                                  }`}
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <h5 className="font-bold text-sm text-gray-900">{coupon.title}</h5>
                                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                        {coupon.type === "percentage"
                                          ? `${coupon.discount}% OFF`
                                          : `₹${coupon.discount} OFF`}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-600">{coupon.description}</p>
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                      <span className="font-mono text-xs font-bold bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-md border border-neutral-200">
                                        {coupon.code}
                                      </span>
                                      <Button
                                        size="sm"
                                        className={`px-5 py-2 rounded-xl font-bold text-xs transition-all duration-200 ${
                                          appliedCoupon?.code === coupon.code
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                                            : "bg-[#ff6900] hover:bg-[#e05d00] text-white shadow-xs hover:shadow-md"
                                        }`}
                                        onClick={() => applyCouponFromSheet(coupon)}
                                        disabled={appliedCoupon?.code === coupon.code}
                                      >
                                        {appliedCoupon?.code === coupon.code ? "✓ APPLIED" : "APPLY"}
                                      </Button>
                                    </div>
                                  </div>
                                </Card>
                              ))
                            ) : (
                              <div className="text-center py-8 text-gray-400">
                                <p className="text-sm font-medium">No coupons currently available</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </ScrollArea>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            )}
          </div>

          {/* Detailed Price Breakdown */}
          <div className="bg-neutral-50/90 rounded-xl p-3 border border-neutral-200/80 space-y-2 text-xs">
            <div className="flex justify-between items-center text-gray-600">
              <span className="font-medium">
                Base price {areDatesSelected ? (nights === 1 ? "(1 night)" : `(${nights} nights)`) : "(1 night)"}
              </span>
              <span className="font-bold text-gray-900">₹{baseAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span className="font-medium">Service fee</span>
              <span className="font-bold text-emerald-600">Free</span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span className="font-medium">Cleaning fee</span>
              <span className="font-bold text-emerald-600">Free</span>
            </div>
            {appliedCoupon && discountAmount > 0 && (
              <div className="flex justify-between items-center text-emerald-600 font-semibold">
                <span>Coupon discount ({appliedCoupon.code})</span>
                <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-gray-600">
              <span className="font-medium">Taxes & GST (18%)</span>
              <span className="font-bold text-gray-900">₹{taxAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Pinned Bottom CTA Section - Fixed at the bottom of the card, ALWAYS visible without scrolling */}
        <div className="shrink-0 border-t border-gray-150 bg-white/98 backdrop-blur-sm p-4 pt-3 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] rounded-b-2xl">
          {/* Scroll Affordance Button placed cleanly at the bottom without overlapping any content */}
          {canScroll && !hasScrolled && (
            <button
              type="button"
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTo({
                    top: scrollContainerRef.current.scrollHeight,
                    behavior: "smooth",
                  });
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 mb-2.5 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100/70 hover:to-amber-100/70 text-[#ff6900] text-[11px] font-bold rounded-xl border border-orange-200/80 transition-all cursor-pointer shadow-2xs"
            >
              <span>View coupons & calculation</span>
              <ChevronDown className="w-3 h-3 animate-bounce" />
            </button>
          )}

          {/* Total Row with Price Breakdown Link */}
          <div className="flex justify-between items-baseline mb-2.5">
            <div>
              <span className="font-bold text-gray-900 text-sm block">
                {areDatesSelected
                  ? nights === 1
                    ? "Total (1 night)"
                    : `Total (${nights} nights)`
                  : "Total per night"}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <span>{totalGuests} {totalGuests === 1 ? "guest" : "guests"}{selectedGuest?.pets > 0 ? `, ${selectedGuest.pets} pet` : ""}</span>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => {
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTo({
                        top: scrollContainerRef.current.scrollHeight,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="font-medium text-[#ff6900] hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <Receipt className="w-3 h-3 inline" />
                  <span>Price details</span>
                </button>
              </div>
            </div>
            <span className="font-black text-xl text-[#ff6900] tracking-tight">
              ₹{finalTotal.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Capacity & Availability Alerts */}
          {isOverCapacity && (
            <div className="mb-2.5 p-2 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-red-700 text-xs">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
              <span className="text-[11px] leading-tight">Max property capacity is {maxCapacity} guests. Please reduce guest count to proceed.</span>
            </div>
          )}
          {availabilityError && (
            <div className="mb-2.5 p-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-2 text-amber-800 text-xs">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" />
              <span className="text-[11px] leading-tight">{availabilityError}</span>
            </div>
          )}

          {/* Reserve / Proceed Button with strict Date & Unit Selection validation */}
          <Button
            onClick={async () => {
              if (isOverCapacity) return;

              // If camping and no tents selected yet, prompt tent selection modal
              if (isCamping && totalSelectedTentsCount === 0) {
                setTentModalOpen(true);
                setAvailabilityError("Please select at least one tent unit to proceed.");
                return;
              }

              // If cottage and no cottages selected yet, prompt cottage selection modal
              if (isCottage && totalSelectedCottagesCount === 0) {
                setCottageModalOpen(true);
                setAvailabilityError("Please select at least one cottage unit to proceed.");
                return;
              }

              // If hotel and no rooms selected yet, prompt room selection modal
              if (isHotel && totalSelectedRoomsCount === 0) {
                setRoomModalOpen(true);
                setAvailabilityError("Please select at least one room unit to proceed.");
                return;
              }

              // Strictly enforce check-in and check-out selection
              if (!checkin || !checkout) {
                setDatePopoverOpen(true);
                if (!checkin) {
                  setWidgetFocusedSide("checkin");
                } else {
                  setWidgetFocusedSide("checkout");
                }
                setAvailabilityError("Please select both check-in and check-out dates to proceed.");
                return;
              }

              setAvailabilityError("");
              setAvailabilityChecking(true);
              if (!isSubtypeProperty) {
                try {
                  const avail = await Checkvillaavailability({
                    propertyId: villa?._id,
                    checkIn: checkInDate.toISOString(),
                    checkOut: checkOutDate.toISOString(),
                  });
                  if (avail && avail.available === false) {
                    setAvailabilityError(avail.message || "This villa is not available for the selected dates.");
                    setAvailabilityChecking(false);
                    return;
                  }
                } catch (e) {
                  console.warn("Availability pre-check failed:", e);
                }
              }
              setAvailabilityChecking(false);

              dispatch(setPropertyId(villa?._id));
              dispatch(setcategoryId(villa?.category));
              dispatch(setOwnerId(villa?.owner));
              dispatch(
                setPropertyType(
                  isCamping
                    ? "Camping"
                    : isCottage
                    ? "Cottage"
                    : isHotel
                    ? "Hotel"
                    : "Villa"
                )
              );
              router.push("/checkout");
            }}
            disabled={isOverCapacity || availabilityChecking}
            className={`w-full text-white font-bold py-3.5 rounded-xl transition-all duration-300 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md ${
              !areDatesSelected ||
              (isCamping && totalSelectedTentsCount === 0) ||
              (isCottage && totalSelectedCottagesCount === 0) ||
              (isHotel && totalSelectedRoomsCount === 0)
                ? "bg-neutral-900 hover:bg-black shadow-neutral-800/20"
                : "bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c84d00] shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.01] active:scale-[0.99]"
            }`}
          >
            {availabilityChecking ? (
              "Checking Availability..."
            ) : isOverCapacity ? (
              `Max ${maxCapacity} Guests Allowed`
            ) : isCamping && totalSelectedTentsCount === 0 ? (
              <>
                <Tent className="w-4 h-4" />
                <span>Select Tents</span>
              </>
            ) : isCottage && totalSelectedCottagesCount === 0 ? (
              <>
                <Trees className="w-4 h-4" />
                <span>Select Cottages</span>
              </>
            ) : isHotel && totalSelectedRoomsCount === 0 ? (
              <>
                <Bed className="w-4 h-4" />
                <span>Select Rooms</span>
              </>
            ) : !checkin ? (
              <>
                <CalendarIcon className="w-4 h-4" />
                <span>Select Check-in Date</span>
              </>
            ) : !checkout ? (
              <>
                <CalendarIcon className="w-4 h-4" />
                <span>Select Check-out Date</span>
              </>
            ) : isCamping ? (
              "Reserve Campsite"
            ) : isCottage ? (
              "Reserve Cottage"
            ) : isHotel ? (
              "Reserve Hotel Stay"
            ) : (
              "Reserve Now"
            )}
          </Button>

          <p className="text-center text-[10px] sm:text-[11px] text-gray-400 mt-1.5">
            {!areDatesSelected
              ? "You won't be charged yet · Dates required to proceed"
              : "You won't be charged yet"}
          </p>
        </div>
      </Card>

      {/* Desktop Tent Selection Modal */}
      {isCamping && (
        <TentSelectionModal
          isOpen={tentModalOpen}
          onClose={() => setTentModalOpen(false)}
          tents={Array.isArray(villa?.tents) ? villa.tents : []}
          totalGuests={totalGuests}
          dateStr={checkin || new Date().toISOString()}
          id={villa?._id}
        />
      )}

      {/* Desktop Cottage Selection Modal */}
      {isCottage && (
        <CottageSelectionModal
          isOpen={cottageModalOpen}
          onClose={() => setCottageModalOpen(false)}
          cottages={Array.isArray(villa?.cottages) ? villa.cottages : []}
          totalGuests={totalGuests}
          dateStr={checkin || new Date().toISOString()}
          id={villa?._id}
        />
      )}

      {/* Desktop Room Selection Modal */}
      {isHotel && (
        <RoomSelectionModal
          isOpen={roomModalOpen}
          onClose={() => setRoomModalOpen(false)}
          rooms={Array.isArray(villa?.rooms) ? villa.rooms : []}
          totalGuests={totalGuests}
          dateStr={checkin || new Date().toISOString()}
          id={villa?._id}
        />
      )}
    </div>
  );
}
