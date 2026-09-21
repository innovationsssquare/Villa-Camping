"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import {
  Calendar as CalendarIcon,
  Users,
  Star,
  Sparkles,
  Tag,
  Percent,
  ArrowRight,
  Minus,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Tent,
  Home,
  Bed,
  Check,
} from "lucide-react";
import { useIndianHolidays } from "@/hooks/useIndianHolidays";
import CouponsDrawer from "./coupons-drawer";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import ButtonLoader from "../Loadercomponents/button-loader";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useAuthModal } from "@/context/AuthModalContext";
import {
  setCheckin,
  setCheckout,
  setSelectedGuest,
  setAppliedCoupon,
  removeCoupon,
  setSelectedTents,
  setSelectedCottages,
  setSelectedRooms,
  clearSelectedTents,
  clearSelectedCottages,
  clearSelectedRooms,
  setPropertyId,
  setOwnerId,
  setPropertyType,
} from "@/Redux/Slices/bookingSlice";
import { getCampingDayDetailsThunk } from "@/Redux/Slices/campingSlice";
import { getCottageDayDetailsThunk } from "@/Redux/Slices/cottageSlice";
import { getHotelDayDetailsThunk } from "@/Redux/Slices/hotelSlice";
import { calculateBookingPrice } from "@/lib/bookingUtils";
import {
  calculateBasePriceForRange,
  useHolidayDates,
  calculateNightBreakdown,
} from "@/lib/pricingUtils";
import { Getallcouponbypropertyid } from "@/lib/API/Coupon/Coupon";
import { BaseUrl } from "@/lib/API/Baseurl";
import { Checkvillaavailability } from "@/lib/API/category/Villa/Villa";
import { format } from "date-fns";
import { calculateCampingTentTotal } from "@/lib/calculateTentBasePrice";
import { Getcampingavability } from "../../lib/API/category/Camping/Camping";
import { Getcottageavability } from "../../lib/API/category/Cottage/Cottage";
import { calculateCottageTotal } from "@/lib/calculateCottageBasePrice";
import { calculateHotelTotal } from "@/lib/calculateHotelBasePrice";
import { Gethotelavability } from "@/lib/API/category/Hotel/Hotel";

export default function BookingDialog({
  isOpen,
  Setopen,
  onClose,
  propertyName,
  price,
  originalPrice,
  propertyId,
  ownerId,
  propertyType = "Villa",
  tents,
  cottages,
  rooms,
  pricing,
  maxCapacity,
  initialTab = "dates",
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { openAuthModal } = useAuthModal();
  const holidayDates = useHolidayDates();

  const isUnitBased = propertyType === "Camping" || propertyType === "Cottage" || propertyType === "Hotel";

  const normalizeInitialTab = (tab) => {
    if (tab === "tents" || tab === "cottages" || tab === "rooms" || tab === "units") return "units";
    return tab || "dates";
  };

  const [activeTab, setActiveTab] = useState(() => normalizeInitialTab(initialTab)); // "dates" | "guests" | "units"
  const [dateStep, setDateStep] = useState("checkin"); // "checkin" | "checkout"
  const [hoveredHoliday, setHoveredHoliday] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isCouponsDrawerOpen, setIsCouponsDrawerOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponsList, setCouponsList] = useState([]);
  const [tentError, setTentError] = useState("");
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);

  // Redux state
  const booking = useSelector((state) => state.booking);
  const selectedGuest = booking?.selectedGuest;
  const checkinISO = booking?.checkin;
  const checkoutISO = booking?.checkout;
  const appliedCoupon = booking?.appliedCoupon;

  const reduxSelectedTents = useSelector((state) => state.booking.selectedTents);
  const reduxSelectedCottages = useSelector((state) => state.booking.selectedCottages);
  const reduxSelectedRooms = useSelector((state) => state.booking.selectedRooms);

  const totalSelectedTentsCount = Object.values(reduxSelectedTents || {}).reduce(
    (sum, t) => sum + (t?.quantity || 0),
    0
  );
  const totalSelectedTentCapacity = Object.values(reduxSelectedTents || {}).reduce(
    (sum, t) => sum + (t?.maxCapacity || 2) * (t?.quantity || 0),
    0
  );

  const totalSelectedCottagesCount = Object.values(reduxSelectedCottages || {}).reduce(
    (sum, c) => sum + (c?.quantity || 0),
    0
  );
  const totalSelectedCottageCapacity = Object.values(reduxSelectedCottages || {}).reduce(
    (sum, c) => sum + (c?.maxCapacity || 2) * (c?.quantity || 0),
    0
  );

  const totalSelectedRoomsCount = Object.values(reduxSelectedRooms || {}).reduce(
    (sum, r) => sum + (r?.quantity || 0),
    0
  );
  const totalSelectedRoomCapacity = Object.values(reduxSelectedRooms || {}).reduce(
    (sum, r) => sum + (r?.maxCapacity || 2) * (r?.quantity || 0),
    0
  );

  const activeUnitCount =
    propertyType === "Camping"
      ? totalSelectedTentsCount
      : propertyType === "Cottage"
      ? totalSelectedCottagesCount
      : propertyType === "Hotel"
      ? totalSelectedRoomsCount
      : 0;

  const activeUnitCapacity =
    propertyType === "Camping"
      ? totalSelectedTentCapacity
      : propertyType === "Cottage"
      ? totalSelectedCottageCapacity
      : propertyType === "Hotel"
      ? totalSelectedRoomCapacity
      : 0;

  const dayTents = useSelector((state) => state.camping?.dayDetails?.tents || state.camping?.dayDetails?.data?.tents || []);
  const dayCottages = useSelector((state) => state.cottage?.dayDetails?.cottages || state.cottage?.dayDetails?.data?.cottages || []);
  const dayRooms = useSelector((state) => state.hotel?.dayDetails?.rooms || state.hotel?.dayDetails?.data?.rooms || []);

  // Safe collections
  const safeTents = useMemo(() => {
    if (!Array.isArray(tents)) return [];
    const map = new Map();
    tents.forEach((t, idx) => {
      const rawType = t.tentType || t.name || `Tent ${idx + 1}`;
      const typeKey = rawType.trim();
      const lowerKey = typeKey.toLowerCase();
      if (!map.has(lowerKey)) {
        map.set(lowerKey, {
          ...t,
          tentType: typeKey,
          totaltents: Number(t.totaltents ?? t.totalUnits ?? 1),
        });
      } else {
        const existing = map.get(lowerKey);
        existing.totaltents = (Number(existing.totaltents) || 0) + Number(t.totaltents ?? t.totalUnits ?? 1);
        const hasImages = existing.tentimages?.length || existing.images?.length;
        if (!hasImages && (t.tentimages?.length || t.images?.length)) {
          existing.tentimages = t.tentimages || t.images;
        }
      }
    });
    return Array.from(map.values());
  }, [tents]);

  const safeCottages = useMemo(() => {
    if (!Array.isArray(cottages)) return [];
    const map = new Map();
    cottages.forEach((c, idx) => {
      const rawType = c.cottageType || c.name || `Cottage ${idx + 1}`;
      const typeKey = rawType.trim();
      const lowerKey = typeKey.toLowerCase();
      if (!map.has(lowerKey)) {
        map.set(lowerKey, {
          ...c,
          cottageType: typeKey,
          totalcottage: Number(c.totalcottage ?? c.totaltents ?? c.totalCottages ?? c.totalUnits ?? 1),
        });
      } else {
        const existing = map.get(lowerKey);
        existing.totalcottage = (Number(existing.totalcottage) || 0) + Number(c.totalcottage ?? c.totaltents ?? c.totalCottages ?? c.totalUnits ?? 1);
        const hasImages = existing.cottageimages?.length || existing.images?.length;
        if (!hasImages && (c.cottageimages?.length || c.images?.length)) {
          existing.cottageimages = c.cottageimages || c.images;
        }
      }
    });
    return Array.from(map.values());
  }, [cottages]);

  const safeRooms = useMemo(() => {
    if (!Array.isArray(rooms)) return [];
    const map = new Map();
    rooms.forEach((r, idx) => {
      const rawType = r.roomType || r.name || `Room ${idx + 1}`;
      const typeKey = rawType.trim();
      const lowerKey = typeKey.toLowerCase();
      if (!map.has(lowerKey)) {
        map.set(lowerKey, {
          ...r,
          roomType: typeKey,
          totalRooms: Number(r.totalRooms ?? r.totaltents ?? r.totalUnits ?? 1),
        });
      } else {
        const existing = map.get(lowerKey);
        existing.totalRooms = (Number(existing.totalRooms) || 0) + Number(r.totalRooms ?? r.totaltents ?? r.totalUnits ?? 1);
        const hasImages = existing.roomimages?.length || existing.images?.length;
        if (!hasImages && (r.roomimages?.length || r.images?.length)) {
          existing.roomimages = r.roomimages || r.images;
        }
      }
    });
    return Array.from(map.values());
  }, [rooms]);

  const checkInDate = checkinISO ? new Date(checkinISO) : null;
  const checkOutDate = checkoutISO ? new Date(checkoutISO) : null;
  const areDatesSelected = Boolean(checkinISO && checkoutISO);

  const msPerDay = 1000 * 60 * 60 * 24;
  const nights = checkInDate && checkOutDate
    ? Math.max(1, Math.round((+checkOutDate - +checkInDate) / msPerDay))
    : 1;

  // Single-month calendar state
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(() => {
    if (checkinISO) {
      const d = new Date(checkinISO);
      return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  // Sync tab & step on open
  useEffect(() => {
    if (isOpen) {
      if (initialTab) setActiveTab(normalizeInitialTab(initialTab));
      if (checkinISO && !checkoutISO) {
        setDateStep("checkout");
        const d = new Date(checkinISO);
        setCurrentCalendarMonth(new Date(d.getFullYear(), d.getMonth(), 1));
      } else if (!checkinISO) {
        setDateStep("checkin");
      }
    }
  }, [isOpen, initialTab, checkinISO, checkoutISO]);

  // Day details fetching for accurate availability & pricing
  const formattedDate = useMemo(() => {
    if (!checkinISO) return null;
    const d = new Date(checkinISO);
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  }, [checkinISO]);

  useEffect(() => {
    if (!propertyId || !formattedDate || !isOpen) return;
    if (propertyType === "Camping") {
      dispatch(getCampingDayDetailsThunk({ id: propertyId, date: formattedDate }));
    } else if (propertyType === "Cottage") {
      dispatch(getCottageDayDetailsThunk({ id: propertyId, date: formattedDate }));
    } else if (propertyType === "Hotel") {
      dispatch(getHotelDayDetailsThunk({ id: propertyId, date: formattedDate }));
    }
  }, [propertyId, formattedDate, isOpen, propertyType, dispatch]);

  // Availability lookup helpers
  const getAvailabilityForTent = (tent) => {
    const typeKey = (tent.tentType || tent.name || "").trim();
    const summary = (dayTents || []).find(
      (t) => (t.tentType || t.name || "").trim().toLowerCase() === typeKey.toLowerCase()
    );
    const configuredTotal = tent.totaltents || 1;
    if (!summary) {
      return {
        total: configuredTotal,
        booked: 0,
        available: configuredTotal,
        weekdayPrice: tent.pricing?.weekdayPrice || 0,
        weekendPrice:
          tent.pricing?.weekendPrice || tent.pricing?.weekdayPrice || 0,
      };
    }
    const availableCount =
      summary.available ??
      Math.max(0, (summary.total ?? configuredTotal) - (summary.booked ?? 0));
    return {
      total: summary.total ?? configuredTotal,
      booked: summary.booked ?? 0,
      available: availableCount,
      weekdayPrice: summary.price?.weekday ?? tent.pricing?.weekdayPrice ?? 0,
      weekendPrice:
        summary.price?.weekend ??
        tent.pricing?.weekendPrice ??
        summary.price?.weekday ??
        0,
    };
  };

  const getAvailabilityForCottage = (cot) => {
    const typeKey = (cot.cottageType || cot.name || "").trim();
    const summary = (dayCottages || []).find(
      (c) => (c.cottageType || c.name || "").trim().toLowerCase() === typeKey.toLowerCase()
    );
    const configuredTotal = cot.totalcottage || cot.totaltents || 1;
    if (!summary) {
      return {
        total: configuredTotal,
        booked: 0,
        available: configuredTotal,
        weekdayPrice: cot.pricing?.weekdayPrice || cot.price || 0,
        weekendPrice:
          cot.pricing?.weekendPrice || cot.price || cot.pricing?.weekdayPrice || 0,
      };
    }
    const availableCount =
      summary.available ??
      Math.max(0, (summary.total ?? configuredTotal) - (summary.booked ?? 0));
    return {
      total: summary.total ?? configuredTotal,
      booked: summary.booked ?? 0,
      available: availableCount,
      weekdayPrice: summary.price?.weekday ?? cot.pricing?.weekdayPrice ?? cot.price ?? 0,
      weekendPrice:
        summary.price?.weekend ??
        cot.pricing?.weekendPrice ??
        summary.price?.weekday ??
        cot.price ??
        0,
    };
  };

  const getAvailabilityForRoom = (room) => {
    const typeKey = (room.roomType || room.name || "").trim();
    const summary = (dayRooms || []).find(
      (r) => (r.roomType || r.name || "").trim().toLowerCase() === typeKey.toLowerCase()
    );
    const configuredTotal = room.totalRooms || room.totaltents || 1;
    if (!summary) {
      return {
        total: configuredTotal,
        booked: 0,
        available: configuredTotal,
        weekdayPrice: room.pricing?.weekdayPrice || room.price || 0,
        weekendPrice:
          room.pricing?.weekendPrice || room.price || room.pricing?.weekdayPrice || 0,
      };
    }
    const availableCount =
      summary.available ??
      Math.max(0, (summary.total ?? configuredTotal) - (summary.booked ?? 0));
    return {
      total: summary.total ?? configuredTotal,
      booked: summary.booked ?? 0,
      available: availableCount,
      weekdayPrice: summary.price?.weekday ?? room.pricing?.weekdayPrice ?? room.price ?? 0,
      weekendPrice:
        summary.price?.weekend ??
        room.pricing?.weekendPrice ??
        summary.price?.weekday ??
        room.price ??
        0,
    };
  };

  // Unit Quantity Stepper Handlers
  const handleTentQtyChange = (tent, delta) => {
    const tentType = tent.tentType;
    const currentQty = reduxSelectedTents?.[tentType]?.quantity || 0;
    const avail = getAvailabilityForTent(tent);
    const nextQty = Math.max(0, Math.min(avail.available, currentQty + delta));
    if (nextQty === currentQty) return;

    const newSelected = { ...reduxSelectedTents };
    if (nextQty === 0) {
      delete newSelected[tentType];
    } else {
      newSelected[tentType] = {
        unitType: "Tent",
        unitId: tent._id,
        typeName: tentType,
        quantity: nextQty,
        weekdayPrice: avail.weekdayPrice,
        weekendPrice: avail.weekendPrice,
        maxCapacity: tent.maxCapacity || 2,
      };
    }
    dispatch(setSelectedTents(newSelected));
    if (tentError) setTentError("");
  };

  const handleCottageQtyChange = (cot, delta) => {
    const cottageType = cot.cottageType;
    const currentQty = reduxSelectedCottages?.[cottageType]?.quantity || 0;
    const avail = getAvailabilityForCottage(cot);
    const nextQty = Math.max(0, Math.min(avail.available, currentQty + delta));
    if (nextQty === currentQty) return;

    const newSelected = { ...reduxSelectedCottages };
    if (nextQty === 0) {
      delete newSelected[cottageType];
    } else {
      newSelected[cottageType] = {
        unitType: "Cottage",
        unitId: cot._id,
        typeName: cottageType,
        quantity: nextQty,
        weekdayPrice: avail.weekdayPrice,
        weekendPrice: avail.weekendPrice,
        maxCapacity: cot.maxCapacity || 2,
      };
    }
    dispatch(setSelectedCottages(newSelected));
    if (tentError) setTentError("");
  };

  const handleRoomQtyChange = (room, delta) => {
    const roomType = room.roomType;
    const currentQty = reduxSelectedRooms?.[roomType]?.quantity || 0;
    const avail = getAvailabilityForRoom(room);
    const nextQty = Math.max(0, Math.min(avail.available, currentQty + delta));
    if (nextQty === currentQty) return;

    const newSelected = { ...reduxSelectedRooms };
    if (nextQty === 0) {
      delete newSelected[roomType];
    } else {
      newSelected[roomType] = {
        unitType: "Room",
        unitId: room._id,
        typeName: roomType,
        quantity: nextQty,
        weekdayPrice: avail.weekdayPrice,
        weekendPrice: avail.weekendPrice,
        maxCapacity: room.maxCapacity || 2,
      };
    }
    dispatch(setSelectedRooms(newSelected));
    if (tentError) setTentError("");
  };

  // Indian Holidays Hook for current calendar year
  const calendarYear = currentCalendarMonth.getFullYear();
  const { isHoliday, getHolidayName, isLongWeekend } = useIndianHolidays(calendarYear);

  // Guest counts
  const guestCounts = {
    adults: Number(selectedGuest?.adults ?? 1),
    children: Number(selectedGuest?.childrenn ?? 0),
    infants: Number(selectedGuest?.infants ?? 0),
    pets: Number(selectedGuest?.pets ?? 0),
  };

  const totalGuests = guestCounts.adults + guestCounts.children;
  const maxCap = Number(maxCapacity || pricing?.maxCapacity || 10);
  const isOverCapacity = propertyType === "Villa" ? totalGuests > maxCap : false;

  // Pricing calculation
  const villaPricing = pricing || {};
  const basePricePerNight =
    Number(price) ||
    Number(villaPricing?.weekdayPrice) ||
    Number(villaPricing?.weekendPrice) ||
    0;

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
  } else if (propertyType === "Hotel") {
    baseAmountForCoupon = calculateHotelTotal(
      reduxSelectedRooms,
      dayRooms,
      checkinISO,
      checkoutISO
    );
    nightsForCoupon = 1;
  } else {
    // Villa (default)
    baseAmountForCoupon = areDatesSelected
      ? calculateBasePriceForRange(
          checkInDate?.toISOString(),
          checkOutDate?.toISOString(),
          villaPricing,
          holidayDates
        )
      : basePricePerNight;
    nightsForCoupon = 1;
  }

  const baseAmount = baseAmountForCoupon;

  const nightBreakdown = areDatesSelected && propertyType === "Villa"
    ? calculateNightBreakdown(
        checkInDate?.toISOString(),
        checkOutDate?.toISOString(),
        villaPricing,
        holidayDates
      )
    : [];

  const { discountAmount, finalTotal, taxAmount } = calculateBookingPrice(
    baseAmount,
    nightsForCoupon,
    appliedCoupon
  );

  // Load available coupons
  useEffect(() => {
    let isMounted = true;
    async function loadCoupons() {
      try {
        let res = null;
        if (propertyId) {
          res = await Getallcouponbypropertyid(propertyId);
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
        console.warn("[booking-dialog] Error loading coupons:", err);
        if (isMounted) setCouponsList([]);
      }
    }
    loadCoupons();
    return () => {
      isMounted = false;
    };
  }, [propertyId]);

  // Calendar Helpers
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isBeforeDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return (
      new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()).getTime() <
      new Date(d2.getFullYear(), d2.getMonth(), d2.getDate()).getTime()
    );
  };

  const isBetweenDays = (target, start, end) => {
    if (!target || !start || !end) return false;
    const t = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
    return t > s && t < e;
  };

  // Month navigation restrictions
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const checkinMonthStart = checkInDate
    ? new Date(checkInDate.getFullYear(), checkInDate.getMonth(), 1)
    : currentMonthStart;

  const isPrevDisabled =
    dateStep === "checkout"
      ? currentCalendarMonth <= checkinMonthStart
      : currentCalendarMonth <= currentMonthStart;

  const handlePrevMonth = () => {
    if (isPrevDisabled) return;
    setCurrentCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Date selection click handler
  const handleDateClick = (cellDate) => {
    const isoString = cellDate.toISOString();

    if (dateStep === "checkin") {
      dispatch(setCheckin(isoString));
      // If previous checkout was before or equal to this new checkin, clear checkout
      if (checkOutDate && cellDate >= checkOutDate) {
        dispatch(setCheckout(null));
      }
      // Immediately and smoothly advance to check-out step!
      setDateStep("checkout");
      setCurrentCalendarMonth(new Date(cellDate.getFullYear(), cellDate.getMonth(), 1));
    } else {
      // Check-out step
      if (!checkInDate) {
        dispatch(setCheckin(isoString));
        setDateStep("checkout");
        return;
      }

      // If user clicked on or before check-in, set as new check-in date
      if (cellDate <= checkInDate) {
        dispatch(setCheckin(isoString));
        dispatch(setCheckout(null));
        setDateStep("checkout");
        return;
      }

      // Valid check-out selection!
      dispatch(setCheckout(isoString));

      // Seamlessly advance to Guests tab after brief delay
      setTimeout(() => {
        setActiveTab("guests");
      }, 350);
    }
  };

  // Guest count updater
  const updateGuest = (type, delta) => {
    const current = guestCounts[type];
    const nextVal = current + delta;

    if (type === "adults" && nextVal < 1) return;
    if (type === "children" && nextVal < 0) return;
    if (type === "infants" && (nextVal < 0 || nextVal > 5)) return;
    if (type === "pets" && (nextVal < 0 || nextVal > 4)) return;

    if ((type === "adults" || type === "children") && delta > 0 && totalGuests >= maxCap) {
      setTentError(`Selected guests (${totalGuests + 1}) exceed maximum property capacity of ${maxCap}`);
      return;
    }

    setTentError("");
    dispatch(
      setSelectedGuest({
        adults: type === "adults" ? nextVal : guestCounts.adults,
        childrenn: type === "children" ? nextVal : guestCounts.children,
        infants: type === "infants" ? nextVal : guestCounts.infants,
        pets: type === "pets" ? nextVal : guestCounts.pets,
      })
    );
  };

  // Coupon handlers
  const handleApplyCouponCode = () => {
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError("");

    const found = couponsList.find(
      (c) => c.code.toLowerCase() === couponInput.trim().toLowerCase()
    );

    if (!found) {
      setCouponError("Invalid coupon code. Tap 'View Available Offers' below.");
      setIsApplyingCoupon(false);
      return;
    }

    if (found.minAmount && baseAmount < found.minAmount) {
      setCouponError(`Minimum booking amount ₹${found.minAmount.toLocaleString()} required`);
      setIsApplyingCoupon(false);
      return;
    }

    dispatch(setAppliedCoupon(found));
    setCouponInput("");
    setIsApplyingCoupon(false);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ["#ff6900", "#10b981", "#3b82f6", "#f59e0b", "#ec4899"],
    });
  };

  const handleApplyCouponFromDrawer = (coupon) => {
    dispatch(setAppliedCoupon(coupon));
    setIsCouponsDrawerOpen(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ["#ff6900", "#10b981", "#3b82f6", "#f59e0b"],
    });
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponError("");
  };

  // Proceed booking
  const handleBooking = async () => {
    if (!checkinISO || !checkoutISO) {
      setActiveTab("dates");
      setDateStep("checkin");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(checkinISO).setHours(0, 0, 0, 0) < today.getTime()) {
      setTentError("Check-in date cannot be in the past. Please select upcoming dates.");
      setActiveTab("dates");
      setDateStep("checkin");
      return;
    }

    if (new Date(checkoutISO).setHours(0, 0, 0, 0) <= new Date(checkinISO).setHours(0, 0, 0, 0)) {
      setTentError("Check-out date must be at least one day after check-in date.");
      setActiveTab("dates");
      setDateStep("checkout");
      return;
    }

    if (propertyType === "Camping") {
      if (totalSelectedTentsCount === 0) {
        setActiveTab("units");
        setTentError("Please select at least one tent unit.");
        return;
      }
      if (totalGuests > totalSelectedTentCapacity) {
        setActiveTab("units");
        setTentError(
          `Selected tents hold ${totalSelectedTentCapacity} guests, but you have ${totalGuests} guests.`
        );
        return;
      }
      setIsLoading(true);
      try {
        const requestedTents = Object.entries(reduxSelectedTents || {}).map(([type, t]) => ({
          tentType: type,
          quantity: t.quantity,
        }));
        const avail = await Getcampingavability({
          propertyId,
          checkIn: checkinISO,
          checkOut: checkoutISO,
          tents: requestedTents,
        });
        if (avail && avail.available === false) {
          setIsLoading(false);
          setTentError(avail.message || "Selected tents are not available for these dates.");
          return;
        }
      } catch (e) {
        console.warn("Camping availability check failed:", e);
      }
    } else if (propertyType === "Cottage") {
      if (totalSelectedCottagesCount === 0) {
        setActiveTab("units");
        setTentError("Please select at least one cottage unit.");
        return;
      }
      if (totalGuests > totalSelectedCottageCapacity) {
        setActiveTab("units");
        setTentError(
          `Selected cottages hold ${totalSelectedCottageCapacity} guests, but you have ${totalGuests} guests.`
        );
        return;
      }
      setIsLoading(true);
      try {
        const requestedCottages = Object.entries(reduxSelectedCottages || {}).map(([type, c]) => ({
          cottageType: type,
          quantity: c.quantity,
        }));
        const avail = await Getcottageavability({
          propertyId,
          checkIn: checkinISO,
          checkOut: checkoutISO,
          cottages: requestedCottages,
        });
        if (avail && avail.available === false) {
          setIsLoading(false);
          setTentError(avail.message || "Selected cottages are not available for these dates.");
          return;
        }
      } catch (e) {
        console.warn("Cottage availability check failed:", e);
      }
    } else if (propertyType === "Hotel") {
      if (totalSelectedRoomsCount === 0) {
        setActiveTab("units");
        setTentError("Please select at least one room unit.");
        return;
      }
      if (totalGuests > totalSelectedRoomCapacity) {
        setActiveTab("units");
        setTentError(
          `Selected rooms hold ${totalSelectedRoomCapacity} guests, but you have ${totalGuests} guests.`
        );
        return;
      }
      setIsLoading(true);
      try {
        const requestedRooms = Object.entries(reduxSelectedRooms || {}).map(([type, r]) => ({
          roomType: type,
          quantity: r.quantity,
        }));
        const avail = await Gethotelavability({
          propertyId,
          checkIn: checkinISO,
          checkOut: checkoutISO,
          rooms: requestedRooms,
        });
        if (avail && avail.available === false) {
          setIsLoading(false);
          setTentError(avail.message || "Selected rooms are not available for these dates.");
          return;
        }
      } catch (e) {
        console.warn("Hotel availability check failed:", e);
      }
    } else {
      // Villa
      if (totalGuests > maxCap) {
        setTentError(`Selected guests (${totalGuests}) exceed maximum property capacity of ${maxCap}`);
        return;
      }

      setIsLoading(true);
      try {
        const availabilityRes = await Checkvillaavailability({
          propertyId,
          checkIn: checkinISO,
          checkOut: checkoutISO,
        });

        if (availabilityRes && availabilityRes.available === false) {
          setIsLoading(false);
          setTentError(availabilityRes?.message || "Villa is not available for selected dates");
          return;
        }
      } catch (e) {
        console.warn("Villa availability check failed:", e);
      }
    }

    setIsLoading(false);

    if (propertyId) dispatch(setPropertyId(propertyId));
    if (ownerId) dispatch(setOwnerId(ownerId));
    if (propertyType) dispatch(setPropertyType(propertyType));

    const token = Cookies.get("token");
    if (!token) {
      onClose?.();
      openAuthModal({ returnUrl: "/checkout" });
      return;
    }

    onClose?.();
    router.push("/checkout");
  };

  const isProceedDisabled =
    isLoading ||
    (!isUnitBased && isOverCapacity) ||
    (isUnitBased && activeUnitCount > 0 && activeUnitCapacity < totalGuests);

  // Calendar Day Grid Computation for Single Month
  const calYear = currentCalendarMonth.getFullYear();
  const calMonth = currentCalendarMonth.getMonth();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const startDayOfWeek = new Date(calYear, calMonth, 1).getDay();

  return (
    <>
      <Drawer
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose?.();
          Setopen?.(open);
        }}
        shouldScaleBackground={false}
      >
        <DrawerContent className="max-h-[88vh] h-[88vh] border-none bg-white rounded-t-[28px] flex flex-col focus:outline-none overflow-hidden">
          <DrawerTitle className="sr-only">Book Your Stay - {propertyName || "Property"}</DrawerTitle>
          {/* Top Grab Handle */}
          <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto my-2 shrink-0" />

          {/* Clean Low-Profile Top Bar: Mode Switcher (Full Width, No Close Icon) */}
          <div className="px-3.5 pb-2 shrink-0">
            {/* Segmented Mode Switcher (Dates vs Guests vs Units) */}
            <div
              className={`w-full grid ${
                isUnitBased ? "grid-cols-3" : "grid-cols-2"
              } gap-1 p-1 bg-neutral-100 rounded-xl border border-neutral-200/80`}
            >
              <button
                type="button"
                onClick={() => setActiveTab("dates")}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  activeTab === "dates"
                    ? "bg-white text-neutral-900 shadow-xs border border-black/5"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                <CalendarIcon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    activeTab === "dates" ? "text-[#ff6900]" : "text-neutral-400"
                  }`}
                />
                <span className="truncate">
                  {areDatesSelected
                    ? `${format(checkInDate, "MMM dd")} – ${format(checkOutDate, "MMM dd")}`
                    : checkinISO
                    ? `${format(checkInDate, "MMM dd")} → Out`
                    : "Dates"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("guests")}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  activeTab === "guests"
                    ? "bg-white text-neutral-900 shadow-xs border border-black/5"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                <Users
                  className={`w-3.5 h-3.5 shrink-0 ${
                    activeTab === "guests" ? "text-[#ff6900]" : "text-neutral-400"
                  }`}
                />
                <span className="truncate">
                  {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
                </span>
              </button>

              {isUnitBased && (
                <button
                  type="button"
                  onClick={() => setActiveTab("units")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    activeTab === "units"
                      ? "bg-white text-neutral-900 shadow-xs border border-black/5"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  {propertyType === "Camping" ? (
                    <Tent
                      className={`w-3.5 h-3.5 shrink-0 ${
                        activeTab === "units" ? "text-[#ff6900]" : "text-neutral-400"
                      }`}
                    />
                  ) : propertyType === "Cottage" ? (
                    <Home
                      className={`w-3.5 h-3.5 shrink-0 ${
                        activeTab === "units" ? "text-[#ff6900]" : "text-neutral-400"
                      }`}
                    />
                  ) : (
                    <Bed
                      className={`w-3.5 h-3.5 shrink-0 ${
                        activeTab === "units" ? "text-[#ff6900]" : "text-neutral-400"
                      }`}
                    />
                  )}
                  <span className="truncate">
                    {propertyType === "Camping"
                      ? totalSelectedTentsCount > 0
                        ? `${totalSelectedTentsCount} ${totalSelectedTentsCount === 1 ? "Tent" : "Tents"}`
                        : "Select Tent"
                      : propertyType === "Cottage"
                      ? totalSelectedCottagesCount > 0
                        ? `${totalSelectedCottagesCount} ${totalSelectedCottagesCount === 1 ? "Cottage" : "Cottages"}`
                        : "Select Cottage"
                      : totalSelectedRoomsCount > 0
                      ? `${totalSelectedRoomsCount} ${totalSelectedRoomsCount === 1 ? "Room" : "Rooms"}`
                      : "Select Room"}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Main Content wrapped in Radix ScrollArea with data-vaul-no-drag & defined height */}
          <ScrollArea
            data-vaul-no-drag
            className="flex-1 min-h-0 h-[calc(88vh-130px)] px-3.5 overflow-y-auto overscroll-contain"
          >
            <div className="space-y-3 pb-8">
              {/* TAB 1: DATES SELECTION (Sequential 1-Month Responsive Flow) */}
              {activeTab === "dates" && (
                <div className="space-y-2.5 animate-in fade-in-50 duration-200">
                  {/* Check-in / Check-out Step Toggle Tabs */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDateStep("checkin");
                        if (checkInDate) {
                          setCurrentCalendarMonth(new Date(checkInDate.getFullYear(), checkInDate.getMonth(), 1));
                        }
                      }}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        dateStep === "checkin"
                          ? "border-[#ff6900] bg-orange-50/60 shadow-xs ring-1 ring-[#ff6900]"
                          : "border-neutral-200 bg-white hover:bg-neutral-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                          1. Check-in
                        </span>
                        {dateStep === "checkin" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900] animate-pulse" />
                        )}
                      </div>
                      <span className="text-xs font-bold text-neutral-900 block truncate mt-0.5">
                        {checkInDate ? format(checkInDate, "EEE, MMM dd") : "Tap date below"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (checkInDate) {
                          setDateStep("checkout");
                          setCurrentCalendarMonth(new Date(checkInDate.getFullYear(), checkInDate.getMonth(), 1));
                        }
                      }}
                      disabled={!checkInDate}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        !checkInDate
                          ? "border-neutral-200 bg-neutral-50 opacity-60 cursor-not-allowed"
                          : dateStep === "checkout"
                          ? "border-[#ff6900] bg-orange-50/60 shadow-xs ring-1 ring-[#ff6900]"
                          : "border-neutral-200 bg-white hover:bg-neutral-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                          2. Check-out
                        </span>
                        {dateStep === "checkout" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900] animate-pulse" />
                        )}
                      </div>
                      <span className="text-xs font-bold text-neutral-900 block truncate mt-0.5">
                        {checkOutDate ? format(checkOutDate, "EEE, MMM dd") : "Tap date below"}
                      </span>
                    </button>
                  </div>

                  {/* Subtitle / Step Guidance */}
                  <div className="flex items-center justify-between px-1 text-xs">
                    <span className="font-semibold text-neutral-700 flex items-center gap-1.5">
                      <span className="text-[#ff6900] font-extrabold">
                        {dateStep === "checkin" ? "Step 1:" : "Step 2:"}
                      </span>
                      {dateStep === "checkin"
                        ? "Select Check-in Date"
                        : `Select Check-out Date (After ${checkInDate ? format(checkInDate, "MMM dd") : ""})`}
                    </span>

                    {areDatesSelected && (
                      <button
                        type="button"
                        onClick={() => {
                          dispatch(setCheckin(null));
                          dispatch(setCheckout(null));
                          setDateStep("checkin");
                        }}
                        className="text-[11px] font-bold text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* 100% RESPONSIVE 1-MONTH CALENDAR */}
                  <div className="border border-neutral-200 rounded-2xl p-2.5 sm:p-3 bg-white shadow-2xs">
                    {/* Month Navigation Header */}
                    <div className="flex items-center justify-between mb-2 px-1">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        disabled={isPrevDisabled}
                        className="w-7 h-7 rounded-full hover:bg-neutral-100 disabled:opacity-20 disabled:hover:bg-transparent flex items-center justify-center text-neutral-700 transition-colors cursor-pointer disabled:cursor-not-allowed"
                        aria-label="Previous month"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <h4 className="font-extrabold text-neutral-900 text-xs sm:text-sm">
                        {format(currentCalendarMonth, "MMMM yyyy")}
                      </h4>

                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="w-7 h-7 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
                        aria-label="Next month"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Days of Week Row */}
                    <div className="grid grid-cols-7 text-center mb-1">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                        <span key={d} className="text-[10px] font-bold text-neutral-400 uppercase py-1">
                          {d}
                        </span>
                      ))}
                    </div>

                    {/* Month Days Grid */}
                    <div className="grid grid-cols-7 gap-y-1">
                      {/* Empty padding days */}
                      {Array.from({ length: startDayOfWeek }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-9 sm:h-10" />
                      ))}

                      {/* Actual Days */}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayNum = i + 1;
                        const cellDate = new Date(calYear, calMonth, dayNum);
                        cellDate.setHours(0, 0, 0, 0);

                        const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                        const holiday = isHoliday(dateStr);
                        const holidayName = getHolidayName(dateStr);
                        const longWeekend = isLongWeekend(dateStr);

                        const isPast = isBeforeDay(cellDate, today);
                        const isCheckin = isSameDay(cellDate, checkInDate);
                        const isCheckout = isSameDay(cellDate, checkOutDate);
                        const isInRange = isBetweenDays(cellDate, checkInDate, checkOutDate);

                        // In checkout mode, dates on or before checkin are disabled
                        const isDisabled =
                          isPast ||
                          (dateStep === "checkout" && checkInDate && (cellDate <= checkInDate || isSameDay(cellDate, checkInDate)));

                        return (
                          <button
                            key={dayNum}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => handleDateClick(cellDate)}
                            onMouseEnter={() => {
                              if (holiday && holidayName) {
                                setHoveredHoliday({ name: holidayName, dateStr });
                              }
                            }}
                            onMouseLeave={() => {
                              if (hoveredHoliday) setHoveredHoliday(null);
                            }}
                            title={holiday ? `⭐ ${holidayName} (Gazetted Holiday)` : undefined}
                            className={`h-9 sm:h-10 w-full flex flex-col items-center justify-center relative text-xs font-semibold transition-all cursor-pointer ${
                              isCheckin
                                ? "bg-[#ff6900] text-white font-extrabold rounded-xl shadow-xs scale-105 z-10"
                                : isCheckout
                                ? "bg-[#ff6900] text-white font-extrabold rounded-xl shadow-xs scale-105 z-10"
                                : isInRange
                                ? "bg-orange-100 text-orange-950 font-bold rounded-none"
                                : isDisabled
                                ? "text-neutral-300 opacity-40 cursor-not-allowed"
                                : holiday
                                ? "bg-amber-50/80 hover:bg-amber-100 text-amber-950 font-bold rounded-xl border border-amber-200/70"
                                : "hover:bg-neutral-100 text-neutral-900 rounded-xl"
                            }`}
                          >
                            <div className="flex items-center gap-0.5 leading-none">
                              <span>{dayNum}</span>
                              {holiday && !isCheckin && !isCheckout && (
                                <span className="text-[9px] leading-none">⭐</span>
                              )}
                            </div>

                            {/* Long weekend indicator */}
                            {longWeekend && !isCheckin && !isCheckout && (
                              <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Holiday Hover Tooltip & Legend Banner */}
                  <div className="min-h-[28px] flex flex-col justify-center px-1">
                    {hoveredHoliday ? (
                      <div className="flex items-start gap-1.5 text-xs text-amber-950 bg-amber-100/90 px-2.5 py-1.5 rounded-lg border border-amber-300 font-bold animate-in fade-in-50 duration-150 w-full shadow-2xs">
                        <span className="text-sm leading-none shrink-0 mt-0.5">⭐</span>
                        <span className="break-words whitespace-normal leading-snug flex-1">
                          {hoveredHoliday.name} (Gazetted Holiday)
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[10px] text-neutral-500 w-full">
                        <span className="flex items-center gap-1 font-medium">
                          <span>⭐</span> Indian Gazetted Holiday
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                          Long Weekend
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Range confirmation banner */}
                  {areDatesSelected && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{nights} {nights === 1 ? "Night" : "Nights"} Selected</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("guests")}
                        className="px-3 py-1 bg-emerald-600 text-white font-bold text-[11px] rounded-lg shadow-2xs hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>Next: Guests</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: GUEST SELECTION */}
              {activeTab === "guests" && (
                <div className="space-y-3 animate-in fade-in-50 duration-200">
                  {/* Capacity / Guest Status Pill */}
                  {!isUnitBased ? (
                    <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      isOverCapacity
                        ? "bg-red-50 border-red-200 text-red-800"
                        : totalGuests === maxCap
                        ? "bg-amber-50 border-amber-200 text-amber-800"
                        : "bg-neutral-50 border-neutral-200/80 text-neutral-800"
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className={`w-3.5 h-3.5 ${isOverCapacity ? "text-red-600" : "text-[#ff6900]"}`} />
                        <span className="font-semibold">Capacity: Max {maxCap} Guests</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isOverCapacity
                          ? "bg-red-200 text-red-900"
                          : totalGuests === maxCap
                          ? "bg-amber-200 text-amber-900"
                          : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {totalGuests} / {maxCap} {isOverCapacity ? "Exceeded" : totalGuests === maxCap ? "Max" : "Selected"}
                      </span>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl border flex items-center justify-between text-xs bg-orange-50/60 border-orange-200/80 text-orange-950">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#ff6900]" />
                        <span className="font-semibold">{totalGuests} {totalGuests === 1 ? "Guest" : "Guests"} Selected</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                        {propertyType === "Camping" ? "Camping Stay" : propertyType === "Cottage" ? "Cottage Stay" : "Hotel Stay"}
                      </span>
                    </div>
                  )}

                  {/* Steppers List */}
                  <div className="bg-white rounded-2xl border border-neutral-200/90 divide-y divide-neutral-150 px-3.5 py-0.5 shadow-2xs">
                    {/* Adults */}
                    <div className="flex items-center justify-between py-2.5">
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">Adults</h4>
                        <p className="text-[10.5px] text-neutral-500">Ages 13 and above</p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => updateGuest("adults", -1)}
                          disabled={guestCounts.adults <= 1}
                          className="w-7 h-7 rounded-full border border-neutral-300 hover:border-neutral-800 disabled:opacity-30 disabled:hover:border-neutral-300 flex items-center justify-center text-neutral-700 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
                          aria-label="Decrease adults"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center text-xs font-extrabold text-neutral-900 select-none">
                          {guestCounts.adults}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateGuest("adults", 1)}
                          disabled={!isUnitBased && totalGuests >= maxCap}
                          className="w-7 h-7 rounded-full border border-neutral-300 hover:border-neutral-800 disabled:opacity-30 disabled:hover:border-neutral-300 flex items-center justify-center text-neutral-700 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
                          aria-label="Increase adults"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between py-2.5">
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">Children</h4>
                        <p className="text-[10.5px] text-neutral-500">Ages 2–12 years</p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => updateGuest("children", -1)}
                          disabled={guestCounts.children <= 0}
                          className="w-7 h-7 rounded-full border border-neutral-300 hover:border-neutral-800 disabled:opacity-30 disabled:hover:border-neutral-300 flex items-center justify-center text-neutral-700 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
                          aria-label="Decrease children"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center text-xs font-extrabold text-neutral-900 select-none">
                          {guestCounts.children}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateGuest("children", 1)}
                          disabled={!isUnitBased && totalGuests >= maxCap}
                          className="w-7 h-7 rounded-full border border-neutral-300 hover:border-neutral-800 disabled:opacity-30 disabled:hover:border-neutral-300 flex items-center justify-center text-neutral-700 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
                          aria-label="Increase children"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center justify-between py-2.5">
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">Infants</h4>
                        <p className="text-[10.5px] text-neutral-500">Under 2 (not counted in guest limit)</p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => updateGuest("infants", -1)}
                          disabled={guestCounts.infants <= 0}
                          className="w-7 h-7 rounded-full border border-neutral-300 hover:border-neutral-800 disabled:opacity-30 disabled:hover:border-neutral-300 flex items-center justify-center text-neutral-700 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
                          aria-label="Decrease infants"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center text-xs font-extrabold text-neutral-900 select-none">
                          {guestCounts.infants}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateGuest("infants", 1)}
                          disabled={guestCounts.infants >= 5}
                          className="w-7 h-7 rounded-full border border-neutral-300 hover:border-neutral-800 disabled:opacity-30 disabled:hover:border-neutral-300 flex items-center justify-center text-neutral-700 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
                          aria-label="Increase infants"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Pets */}
                    <div className="flex items-center justify-between py-2.5">
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">Pets</h4>
                        <p className="text-[10.5px] text-neutral-500">Bringing a companion animal?</p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => updateGuest("pets", -1)}
                          disabled={guestCounts.pets <= 0}
                          className="w-7 h-7 rounded-full border border-neutral-300 hover:border-neutral-800 disabled:opacity-30 disabled:hover:border-neutral-300 flex items-center justify-center text-neutral-700 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
                          aria-label="Decrease pets"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center text-xs font-extrabold text-neutral-900 select-none">
                          {guestCounts.pets}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateGuest("pets", 1)}
                          disabled={guestCounts.pets >= 4}
                          className="w-7 h-7 rounded-full border border-neutral-300 hover:border-neutral-800 disabled:opacity-30 disabled:hover:border-neutral-300 flex items-center justify-center text-neutral-700 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
                          aria-label="Increase pets"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* For Unit-based stays, show "Next: Select Tents / Cottages / Rooms" button */}
                  {isUnitBased && (
                    <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200/80 flex items-center justify-between shadow-2xs">
                      <div>
                        <span className="text-xs font-bold text-neutral-900 block">
                          {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
                        </span>
                        <span className="text-[10.5px] text-neutral-500">
                          {propertyType === "Camping"
                            ? "Proceed to choose campsite tents"
                            : propertyType === "Cottage"
                            ? "Proceed to choose cottage units"
                            : "Proceed to choose hotel rooms"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("units")}
                        className="px-3.5 py-1.5 bg-[#ff6900] hover:bg-[#e05d00] text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <span>
                          {propertyType === "Camping"
                            ? "Next: Tents"
                            : propertyType === "Cottage"
                            ? "Next: Cottages"
                            : "Next: Rooms"}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ACCOMMODATION / UNIT SELECTION */}
              {activeTab === "units" && isUnitBased && (
                <div className="space-y-3 animate-in fade-in-50 duration-200">
                  {/* Capacity Status Banner */}
                  <div
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      activeUnitCount === 0
                        ? "bg-amber-50 border-amber-200 text-amber-900"
                        : activeUnitCapacity < totalGuests
                        ? "bg-amber-50 border-amber-200 text-amber-900"
                        : "bg-emerald-50 border-emerald-200 text-emerald-900"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck
                        className={`w-3.5 h-3.5 ${
                          activeUnitCount === 0 || activeUnitCapacity < totalGuests
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }`}
                      />
                      <span className="font-semibold">
                        {activeUnitCount === 0
                          ? `Select ${propertyType === "Camping" ? "tents" : propertyType === "Cottage" ? "cottages" : "rooms"} for ${totalGuests} ${totalGuests === 1 ? "guest" : "guests"}`
                          : `Capacity: ${activeUnitCapacity} / ${totalGuests} ${totalGuests === 1 ? "Guest" : "Guests"}`}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        activeUnitCount === 0 || activeUnitCapacity < totalGuests
                          ? "bg-amber-200/80 text-amber-900"
                          : "bg-emerald-200/80 text-emerald-900"
                      }`}
                    >
                      {activeUnitCount === 0
                        ? "Required"
                        : activeUnitCapacity < totalGuests
                        ? `Need +${totalGuests - activeUnitCapacity}`
                        : "Covered"}
                    </span>
                  </div>

                  {/* Unit Cards List */}
                  <div className="space-y-2.5">
                    {propertyType === "Camping" && (
                      safeTents.length > 0 ? (
                        safeTents.map((tent, idx) => {
                          const typeKey = tent.tentType;
                          const currentQty = reduxSelectedTents?.[typeKey]?.quantity || 0;
                          const avail = getAvailabilityForTent(tent);
                          const tentImg = tent.tentimages?.[0] || tent.images?.[0] || "/placeholder.svg";
                          const isWeekendSelected = checkInDate ? (checkInDate.getDay() === 5 || checkInDate.getDay() === 6) : false;
                          const displayPrice = isWeekendSelected ? avail.weekendPrice : avail.weekdayPrice;

                          return (
                            <div
                              key={tent._id || idx}
                              className={`p-3 rounded-2xl border transition-all ${
                                currentQty > 0
                                  ? "bg-orange-50/40 border-orange-300 ring-1 ring-orange-200 shadow-2xs"
                                  : "bg-white border-neutral-200/90 shadow-2xs"
                              }`}
                            >
                              <div className="flex gap-3">
                                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-black/5">
                                  <Image
                                    src={tentImg}
                                    alt={tent.tentType}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                  />
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-start justify-between gap-1">
                                      <h4 className="text-xs font-bold text-neutral-900 truncate">
                                        {tent.tentType} Tent
                                      </h4>
                                      <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded shrink-0">
                                        {avail.available} left
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10.5px] text-neutral-500 mt-0.5">
                                      <Users className="w-3 h-3 text-[#ff6900]" />
                                      <span>Up to {tent.maxCapacity || 2} guests</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-150/60">
                                    <div>
                                      <span className="text-xs font-black text-neutral-900">
                                        ₹{displayPrice.toLocaleString()}
                                      </span>
                                      <span className="text-[9.5px] text-neutral-400 font-normal"> / night</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => handleTentQtyChange(tent, -1)}
                                        disabled={currentQty <= 0}
                                        className="w-7 h-7 rounded-full border border-neutral-300 hover:border-neutral-800 disabled:opacity-30 disabled:hover:border-neutral-300 flex items-center justify-center text-neutral-700 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
                                        aria-label={`Decrease ${tent.tentType}`}
                                      >
                                        <Minus className="w-3.5 h-3.5" />
                                      </button>
                                      <span className="w-5 text-center text-xs font-extrabold text-neutral-900 select-none">
                                        {currentQty}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleTentQtyChange(tent, 1)}
                                        disabled={currentQty >= avail.available}
                                        className="w-7 h-7 rounded-full border border-neutral-300 hover:border-neutral-800 disabled:opacity-30 disabled:hover:border-neutral-300 flex items-center justify-center text-neutral-700 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
                                        aria-label={`Increase ${tent.tentType}`}
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-6 text-center text-neutral-400 text-xs bg-neutral-50 rounded-2xl border border-neutral-200">
                          No tents available for this campsite.
                        </div>
                      )
                    )}

                    {propertyType === "Cottage" && (
                      safeCottages.length > 0 ? (
                        safeCottages.map((cot, idx) => {
                          const typeKey = cot.cottageType;
                          const currentQty = reduxSelectedCottages?.[typeKey]?.quantity || 0;
                          const avail = getAvailabilityForCottage(cot);
                          const cotImg = cot.cottageimages?.[0] || cot.images?.[0] || "/placeholder.svg";
                          const isWeekendSelected = checkInDate ? (checkInDate.getDay() === 5 || checkInDate.getDay() === 6) : false;
                          const displayPrice = isWeekendSelected ? avail.weekendPrice : avail.weekdayPrice;

                          return (
                            <div
                              key={cot._id || idx}
                              className={`p-3 rounded-2xl border transition-all ${
                                currentQty > 0
                                  ? "bg-orange-50/40 border-orange-300 ring-1 ring-orange-200 shadow-2xs"
                                  : "bg-white border-neutral-200/90 shadow-2xs"
                              }`}
                            >
                              <div className="flex gap-3">
                                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-black/5">
                                  <Image
                                    src={cotImg}
                                    alt={cot.cottageType}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                  />
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-start justify-between gap-1">
                                      <h4 className="text-xs font-bold text-neutral-900 truncate">
                                        {cot.cottageType}
                                      </h4>
                                      <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded shrink-0">
                                        {avail.available} left
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10.5px] text-neutral-500 mt-0.5">
                                      <Users className="w-3 h-3 text-[#ff6900]" />
                                      <span>Up to {cot.maxCapacity || 2} guests</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-150/60">
                                    <div>
                                      <span className="text-xs font-black text-neutral-900">
                                        ₹{displayPrice.toLocaleString()}
                                      </span>
                                      <span className="text-[9.5px] text-neutral-400 font-normal"> / night</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => handleCottageQtyChange(cot, -1)}
                                        disabled={currentQty <= 0}
                                        className="w-7 h-7 rounded-full border border-neutral-300 hover:border-neutral-800 disabled:opacity-30 disabled:hover:border-neutral-300 flex items-center justify-center text-neutral-700 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
                                        aria-label={`Decrease ${cot.cottageType}`}
                                      >
                                        <Minus className="w-3.5 h-3.5" />
                                      </button>
                                      <span className="w-5 text-center text-xs font-extrabold text-neutral-900 select-none">
                                        {currentQty}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleCottageQtyChange(cot, 1)}
                                        disabled={currentQty >= avail.available}
                                        className="w-7 h-7 rounded-full border border-neutral-300 hover:border-neutral-800 disabled:opacity-30 disabled:hover:border-neutral-300 flex items-center justify-center text-neutral-700 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
                                        aria-label={`Increase ${cot.cottageType}`}
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-6 text-center text-neutral-400 text-xs bg-neutral-50 rounded-2xl border border-neutral-200">
                          No cottages available for this property.
                        </div>
                      )
                    )}

                    {propertyType === "Hotel" && (
                      safeRooms.length > 0 ? (
                        safeRooms.map((room, idx) => {
                          const typeKey = room.roomType;
                          const currentQty = reduxSelectedRooms?.[typeKey]?.quantity || 0;
                          const avail = getAvailabilityForRoom(room);
                          const roomImg = room.roomimages?.[0] || room.images?.[0] || "/placeholder.svg";
                          const isWeekendSelected = checkInDate ? (checkInDate.getDay() === 5 || checkInDate.getDay() === 6) : false;
                          const displayPrice = isWeekendSelected ? avail.weekendPrice : avail.weekdayPrice;

                          return (
                            <div
                              key={room._id || idx}
                              className={`p-3 rounded-2xl border transition-all ${
                                currentQty > 0
                                  ? "bg-orange-50/40 border-orange-300 ring-1 ring-orange-200 shadow-2xs"
                                  : "bg-white border-neutral-200/90 shadow-2xs"
                              }`}
                            >
                              <div className="flex gap-3">
                                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-black/5">
                                  <Image
                                    src={roomImg}
                                    alt={room.roomType}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                  />
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-start justify-between gap-1">
                                      <h4 className="text-xs font-bold text-neutral-900 truncate">
                                        {room.roomType}
                                      </h4>
                                      <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded shrink-0">
                                        {avail.available} left
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10.5px] text-neutral-500 mt-0.5">
                                      <Users className="w-3 h-3 text-[#ff6900]" />
                                      <span>Up to {room.maxCapacity || 2} guests</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-150/60">
                                    <div>
                                      <span className="text-xs font-black text-neutral-900">
                                        ₹{displayPrice.toLocaleString()}
                                      </span>
                                      <span className="text-[9.5px] text-neutral-400 font-normal"> / night</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => handleRoomQtyChange(room, -1)}
                                        disabled={currentQty <= 0}
                                        className="w-7 h-7 rounded-full border border-neutral-300 hover:border-neutral-800 disabled:opacity-30 disabled:hover:border-neutral-300 flex items-center justify-center text-neutral-700 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
                                        aria-label={`Decrease ${room.roomType}`}
                                      >
                                        <Minus className="w-3.5 h-3.5" />
                                      </button>
                                      <span className="w-5 text-center text-xs font-extrabold text-neutral-900 select-none">
                                        {currentQty}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleRoomQtyChange(room, 1)}
                                        disabled={currentQty >= avail.available}
                                        className="w-7 h-7 rounded-full border border-neutral-300 hover:border-neutral-800 disabled:opacity-30 disabled:hover:border-neutral-300 flex items-center justify-center text-neutral-700 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
                                        aria-label={`Increase ${room.roomType}`}
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-6 text-center text-neutral-400 text-xs bg-neutral-50 rounded-2xl border border-neutral-200">
                          No rooms available for this hotel.
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Accommodation Card for Camping, Cottage, Hotel */}
              {isUnitBased && (
                <div className="p-3 bg-white rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#ff6900] uppercase tracking-wider block">
                        {propertyType === "Camping"
                          ? "Campsite Accommodation"
                          : propertyType === "Cottage"
                          ? "Cottage Accommodation"
                          : "Hotel Accommodation"}
                      </span>
                      <h4 className="text-xs font-bold text-neutral-900 mt-0.5">
                        {activeUnitCount > 0
                          ? `${activeUnitCount} ${
                              propertyType === "Camping"
                                ? activeUnitCount === 1 ? "Tent" : "Tents"
                                : propertyType === "Cottage"
                                ? activeUnitCount === 1 ? "Cottage" : "Cottages"
                                : activeUnitCount === 1 ? "Room" : "Rooms"
                            } Selected`
                          : `No ${
                              propertyType === "Camping"
                                ? "Tents"
                                : propertyType === "Cottage"
                                ? "Cottages"
                                : "Rooms"
                            } Selected`}
                      </h4>
                      <p className="text-[10.5px] text-neutral-500">
                        {activeUnitCount > 0
                          ? `Accommodates up to ${activeUnitCapacity} guests`
                          : `Select your ${
                              propertyType === "Camping"
                                ? "tent"
                                : propertyType === "Cottage"
                                ? "cottage"
                                : "room"
                            } type & units to proceed`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("units")}
                      className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#ff6900] border border-orange-200 font-bold text-xs rounded-xl transition-all active:scale-95 cursor-pointer"
                    >
                      {activeUnitCount > 0 ? "Change" : "Select"}
                    </button>
                  </div>
                </div>
              )}

              {/* PRICING BREAKDOWN & DETAILS */}
              <div className="bg-neutral-50/90 rounded-2xl p-3 border border-neutral-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-neutral-700 block">Stay Pricing</span>
                    <span className="text-[10.5px] text-neutral-500">
                      {areDatesSelected
                        ? `₹${Math.round(baseAmount / Math.max(1, nights)).toLocaleString()} × ${nights} ${nights === 1 ? "night" : "nights"}`
                        : "Base rate per night"}
                    </span>
                  </div>
                  <span className="text-xs font-black text-neutral-900">
                    ₹{baseAmount.toLocaleString()}
                  </span>
                </div>

                {/* Nightly breakdown toggle if multiple nights */}
                {nightBreakdown.length > 1 && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                      className="text-[10.5px] font-bold text-[#ff6900] hover:text-[#e05d00] flex items-center gap-1 cursor-pointer"
                    >
                      <span>{showPriceBreakdown ? "Hide nightly rates" : "View nightly rates & holiday surcharges"}</span>
                      {showPriceBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {showPriceBreakdown && (
                      <div className="mt-1.5 space-y-1 pl-2 border-l-2 border-orange-200">
                        {nightBreakdown.map((nb, i) => (
                          <div key={i} className="flex items-center justify-between text-[10.5px] text-neutral-600">
                            <span className="flex items-center gap-1">
                              <span>{nb.dateStr}</span>
                              {nb.isHoliday && <span className="text-amber-600 font-bold">⭐ {nb.holidayName}</span>}
                              {nb.isWeekend && !nb.isHoliday && <span className="text-blue-600 font-semibold">(Weekend)</span>}
                            </span>
                            <span className="font-semibold text-neutral-800">₹{nb.rate.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Discount Line */}
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-xs text-emerald-600 font-semibold">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Coupon Discount ({appliedCoupon?.code})
                    </span>
                    <span className="font-bold">-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                {/* Taxes & GST */}
                <div className="flex items-center justify-between text-xs text-neutral-600">
                  <span>Taxes & GST (18%)</span>
                  <span className="font-semibold text-neutral-900">₹{taxAmount.toLocaleString()}</span>
                </div>

                {/* Total Row */}
                <div className="border-t border-neutral-200 pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-neutral-900">Total</span>
                    <span className="text-[10px] text-neutral-500 block">Includes all taxes</span>
                  </div>
                  <span className="text-base font-black text-neutral-900">
                    ₹{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* COUPON SECTION */}
              <div className="space-y-2">
                {appliedCoupon ? (
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
                        <Percent className="w-3 h-3" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-950">{appliedCoupon.code}</p>
                        <p className="text-[10px] text-emerald-700">₹{discountAmount.toLocaleString()} discount applied!</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[10.5px] font-bold text-red-600 hover:text-red-700 bg-white px-2 py-1 rounded-lg border border-red-200 cursor-pointer active:scale-95 transition-all"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value.toUpperCase());
                            if (couponError) setCouponError("");
                          }}
                          placeholder="Enter coupon code"
                          className="w-full pl-8 pr-3 py-1.5 text-xs font-semibold uppercase bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-[#ff6900]"
                        />
                      </div>
                      <button
                        type="button"
                        disabled={!couponInput.trim() || isApplyingCoupon}
                        onClick={handleApplyCouponCode}
                        className="px-3.5 py-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                      >
                        {isApplyingCoupon ? "..." : "Apply"}
                      </button>
                    </div>

                    {couponError && (
                      <p className="text-[10.5px] text-red-600 font-medium px-1">{couponError}</p>
                    )}

                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => setIsCouponsDrawerOpen(true)}
                        className="text-[11px] font-bold text-[#ff6900] hover:text-[#e05d00] flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>View available coupons</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message Banner if any */}
              {tentError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-medium">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{tentError}</span>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Sticky Bottom Action Bar */}
          <div className="p-3 sm:p-3.5 bg-white/95 backdrop-blur-md border-t border-neutral-200 flex items-center justify-between gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] shrink-0">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-neutral-900 tracking-tight">
                  ₹{finalTotal.toLocaleString()}
                </span>
                {discountAmount > 0 && (
                  <span className="text-xs text-neutral-400 line-through">
                    ₹{(baseAmount + taxAmount).toLocaleString()}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-neutral-500 font-medium block">
                {areDatesSelected
                  ? nights === 1
                    ? "Total (1 night · Incl. taxes)"
                    : `Total (${nights} nights · Incl. taxes)`
                  : "Per night + taxes"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!areDatesSelected) {
                  setActiveTab("dates");
                  return;
                }
                if (isUnitBased && activeUnitCount === 0) {
                  setActiveTab("units");
                  return;
                }
                handleBooking();
              }}
              disabled={isProceedDisabled}
              className="flex-1 max-w-[190px] h-10 bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c84d00] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isLoading ? (
                <ButtonLoader />
              ) : !areDatesSelected ? (
                "Select Dates"
              ) : isUnitBased && activeUnitCount === 0 ? (
                propertyType === "Camping"
                  ? "Select Tents"
                  : propertyType === "Cottage"
                  ? "Select Cottages"
                  : "Select Rooms"
              ) : isUnitBased && activeUnitCapacity < totalGuests ? (
                `Need +${totalGuests - activeUnitCapacity} Cap.`
              ) : !isUnitBased && isOverCapacity ? (
                "Exceeds Capacity"
              ) : (
                "Proceed to Book"
              )}
            </button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Available Coupons Drawer */}
      <CouponsDrawer
        isOpen={isCouponsDrawerOpen}
        onClose={() => setIsCouponsDrawerOpen(false)}
        onApplyCoupon={handleApplyCouponFromDrawer}
        appliedCoupon={appliedCoupon}
        propertyId={propertyId}
        propertyType={propertyType}
        subtotal={baseAmount}
        checkIn={checkinISO}
        checkOut={checkoutISO}
        nights={nights}
      />
    </>
  );
}
