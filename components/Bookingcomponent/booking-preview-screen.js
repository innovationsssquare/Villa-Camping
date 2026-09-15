"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Users,
  ShieldCheck,
  Ticket,
  Check,
  Sparkles,
  MapPin,
  Star,
  Gift,
  ChevronRight,
  X,
  AlertCircle,
  Lock,
  Phone,
  Mail,
  Home,
  Tent,
  Hotel,
  Clock,
  Info,
  Utensils,
  CookingPot,
  Flame,
  Coffee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import CouponsDrawer from "@/components/Propertyviewcomponents/coupons-drawer";
import BookingDetailsDrawer from "@/components/Bookingcomponent/booking-details-drawer";
import PropertyEventSection from "@/components/Bookingcomponent/PropertyEventSection";
import EventDetailsModal from "@/components/Bookingcomponent/EventDetailsModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchproperty } from "@/Redux/Slices/propertiesSlice";
import Image from "next/image";
import {
  setAppliedCoupon,
  removeCoupon,
  setSpecialRequests,
  setAcceptedTerms,
  setCustomerDetails,
} from "@/Redux/Slices/bookingSlice";
import confetti from "canvas-confetti";
import { calculateBookingPrice } from "@/lib/bookingUtils";
import { Createbooking, Verifybooking } from "@/lib/API/Booking/Booking";
import { useToast } from "@/components/ui/toast-provider";
import Successmodal from "./Successmodal";
import ButtonLoader from "../Loadercomponents/button-loader";
import Overlay from "./Overlay";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { getDeviceId } from "@/lib/deviceId";
import {
  calculateBasePriceForRange,
  useHolidayDates,
  calculateNightBreakdown,
} from "@/lib/pricingUtils";
import { Checkvillaavailability } from "@/lib/API/category/Villa/Villa";
import { Getcampingavability } from "@/lib/API/category/Camping/Camping";
import { Getcottageavability } from "@/lib/API/category/Cottage/Cottage";
import { Gethotelavability } from "@/lib/API/category/Hotel/Hotel";
import { calculateCampingTentTotal } from "@/lib/calculateTentBasePrice";
import { calculateCottageTotal } from "@/lib/calculateCottageBasePrice";
import { calculateHotelTotal } from "@/lib/calculateHotelBasePrice";

export default function BookingPreviewScreen() {
  const {
    checkin,
    checkout,
    selectedGuest,
    propertyId,
    categoryId,
    ownerId,
    propertyType,
    customerDetails,
    specialRequests,
    acceptedTerms,
  } = useSelector((state) => state.booking);
  const { property, loading, error } = useSelector((state) => state.properties);
  const dispatch = useDispatch();
  const router = useRouter();
  const { addToast } = useToast();
  const holidayDates = useHolidayDates();

  const [openmodel, setopenmodal] = useState(false);
  const [opensucessmodal, setOpensuccesmodal] = useState(false);
  const [loadingg, setloading] = useState(false);
  const [isCouponsDrawerOpen, setIsCouponsDrawerOpen] = useState(false);
  const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);
  const [showSpecialRequests, setShowSpecialRequests] = useState(false);

  // Property Events state
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [eventAttendees, setEventAttendees] = useState(1);
  const [inspectingEvent, setInspectingEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const appliedCoupon = useSelector((state) => state.booking.appliedCoupon);

  const reduxSelectedTents = useSelector(
    (state) => state.booking.selectedTents || {}
  );
  const reduxSelectedCottages = useSelector(
    (state) => state.booking.selectedCottages || {}
  );
  const reduxSelectedRooms = useSelector(
    (state) => state.booking.selectedRooms || {}
  );

  const dayTents = useSelector(
    (state) => state.camping?.dayDetails?.tents || []
  );
  const dayCottages = useSelector(
    (state) => state.cottage?.dayDetails?.cottages || []
  );
  const dayRooms = useSelector(
    (state) => state.hotel?.dayDetails?.rooms || []
  );

  // Auto-populate customer details from localStorage if not present
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const storedUserStr = localStorage.getItem("thevilla_user");
        if (storedUserStr) {
          const u = JSON.parse(storedUserStr);
          const updates = {};
          if (!customerDetails?.firstName && (u.fullName || u.name)) {
            const parts = (u.fullName || u.name).split(" ");
            updates.firstName = parts[0] || "";
            updates.lastName = parts.slice(1).join(" ") || "";
          }
          if (!customerDetails?.email && u.email) updates.email = u.email;
          if (!customerDetails?.mobile && u.mobile)
            updates.mobile = String(u.mobile).replace(/\D/g, "");
          if (!customerDetails?.city && u.city) updates.city = u.city;

          if (Object.keys(updates).length > 0) {
            dispatch(setCustomerDetails(updates));
          }
        }
      }
    } catch {}
  }, [dispatch]);

  useEffect(() => {
    if (categoryId && propertyId) {
      dispatch(fetchproperty({ categoryId, propertyId }));
    }
  }, [dispatch, categoryId, propertyId]);

  useEffect(() => {
    if (!categoryId && !propertyId) {
      setopenmodal(true);
    }
  }, [categoryId, propertyId]);

  // Discard applied coupon if it belongs to a different property or was used on this device
  useEffect(() => {
    if (appliedCoupon) {
      if (!appliedCoupon._id && !appliedCoupon.couponId && !appliedCoupon.id) {
        dispatch(removeCoupon());
        return;
      }
      if (propertyId) {
        if (appliedCoupon.property && appliedCoupon.property.toString() !== propertyId.toString()) {
          dispatch(removeCoupon());
          return;
        } else if (appliedCoupon.propertyTypes && propertyType && appliedCoupon.propertyTypes.toLowerCase() !== propertyType.toLowerCase()) {
          dispatch(removeCoupon());
          return;
        }
      }
      getDeviceId().then((did) => {
        if (did && Array.isArray(appliedCoupon.devicesUsed) && appliedCoupon.devicesUsed.includes(did)) {
          dispatch(removeCoupon());
        }
      });
    }
  }, [appliedCoupon, propertyId, propertyType, dispatch]);

  const getCustomerId = () => {
    try {
      if (typeof window === "undefined") return null;
      return (
        localStorage.getItem("thevilla_user_id") ||
        localStorage.getItem("customer_id") ||
        null
      );
    } catch {
      return null;
    }
  };

  const checkInDate = checkin ? new Date(checkin) : new Date();
  const checkOutDate = checkout
    ? new Date(checkout)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);
  const msPerDay = 1000 * 60 * 60 * 24;
  const nights = Math.max(
    1,
    Math.round((+checkOutDate - +checkInDate) / msPerDay)
  );

  const guestCounts = {
    adults: Number(selectedGuest?.adults ?? 1),
    children: Number(selectedGuest?.childrenn ?? 0),
    infants: Number(selectedGuest?.infants ?? 0),
    pets: Number(selectedGuest?.pets ?? 0),
  };

  const totalGuests =
    guestCounts.adults + guestCounts.children + guestCounts.infants;

  // 1. Precise Base Amount Calculation Across All Properties
  let baseAmountForCoupon = 0;
  const normalizedType = propertyType?.toLowerCase() || "";

  if (normalizedType === "camping") {
    const tentsCount = Object.values(reduxSelectedTents).reduce(
      (sum, t) => sum + (t.quantity || 0),
      0
    );
    if (tentsCount > 0) {
      baseAmountForCoupon = calculateCampingTentTotal(
        reduxSelectedTents,
        dayTents,
        checkin,
        checkout
      );
    } else {
      baseAmountForCoupon = (Number(property?.basePricePerNight) || 1200) * nights;
    }
  } else if (normalizedType === "cottage") {
    const cottagesCount = Object.values(reduxSelectedCottages).reduce(
      (sum, c) => sum + (c.quantity || 0),
      0
    );
    if (cottagesCount > 0) {
      baseAmountForCoupon = calculateCottageTotal(
        reduxSelectedCottages,
        dayCottages,
        checkin,
        checkout
      );
    } else {
      baseAmountForCoupon = (Number(property?.basePricePerNight) || 2500) * nights;
    }
  } else if (normalizedType === "hotel") {
    const roomsCount = Object.values(reduxSelectedRooms).reduce(
      (sum, r) => sum + (r.quantity || 0),
      0
    );
    if (roomsCount > 0) {
      baseAmountForCoupon = calculateHotelTotal(
        reduxSelectedRooms,
        dayRooms,
        checkin,
        checkout
      );
    } else {
      baseAmountForCoupon = (Number(property?.basePricePerNight) || 2000) * nights;
    }
  } else {
    // Villa: Range calculation accounting for weekday, weekend, and Indian holiday dates
    baseAmountForCoupon = calculateBasePriceForRange(
      checkInDate?.toISOString(),
      checkOutDate?.toISOString(),
      property?.pricing ?? {},
      holidayDates
    );
    if (!baseAmountForCoupon || baseAmountForCoupon === 0) {
      baseAmountForCoupon =
        (Number(property?.pricing?.weekdayPrice) ||
          Number(property?.basePricePerNight) ||
          1500) * nights;
    }
  }

  // 2. Uniform nightsForCoupon = 1 because baseAmountForCoupon ALREADY computes the entire stay
  const { basePrice, discountAmount, taxAmount, finalTotal } =
    calculateBookingPrice(baseAmountForCoupon, 1, appliedCoupon);

  // Synchronize default event attendees with totalGuests
  useEffect(() => {
    if (totalGuests > 0) {
      setEventAttendees(totalGuests);
    }
  }, [totalGuests]);

  // Active property events & calculated extra charge
  const activeEvents = (property?.events || []).filter(
    (e) => e.isActive !== false && (!e.endDate || new Date(e.endDate) >= new Date())
  );
  const selectedEvent = activeEvents.find((e) => e._id === selectedEventId) || null;
  const eventExtraCharge =
    selectedEvent && !selectedEvent.isIncludedInStay
      ? (Number(selectedEvent.pricePerPerson) || 0) * (Number(eventAttendees) || 1)
      : 0;

  // Meal selection & dynamic charges
  const [isMealPackageSelected, setIsMealPackageSelected] = useState(false);
  const adultMealPrice = Number(property?.foodOptions?.adultPrice) || 0;
  const childMealPrice = Number(property?.foodOptions?.childPrice) || 0;
  const adultsCount = Number(guestCounts?.adults) || 1;
  const childrenCount = Number(guestCounts?.children) || 0;
  const mealNights = nights || 1;
  const totalMealCharge =
    isMealPackageSelected && (adultMealPrice > 0 || childMealPrice > 0)
      ? ((adultMealPrice * adultsCount) + (childMealPrice * childrenCount)) * mealNights
      : 0;

  // Dynamic tax & payable total including event & meal charges
  const baseAmountWithDiscount = Math.max(0, (basePrice || 0) - (discountAmount || 0));
  const taxableAmount = baseAmountWithDiscount + eventExtraCharge + totalMealCharge;
  const dynamicTaxAmount = Math.round(taxableAmount * 0.18);
  const finalPayableTotal = taxableAmount + dynamicTaxAmount;

  // Count weekday vs weekend vs holiday nights for the villa price breakdown label
  const villaNightBreakdown =
    normalizedType === "villa"
      ? calculateNightBreakdown(
          checkInDate?.toISOString(),
          checkOutDate?.toISOString(),
          property?.pricing ?? {},
          holidayDates
        )
      : null;

  const formatRupee = (amount) => {
    return `₹${Math.round(Number(amount) || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const handleApplyCoupon = (coupon) => {
    dispatch(setAppliedCoupon(coupon));
    setIsCouponsDrawerOpen(false);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } });
  };

  const handleRemoveCouponClick = () => {
    dispatch(removeCoupon());
  };

  const isGuestDetailsComplete = () => {
    return Boolean(
      customerDetails?.firstName?.trim() &&
      customerDetails?.lastName?.trim() &&
      customerDetails?.mobile?.trim() &&
      customerDetails?.email?.trim()
    );
  };

  const handlePayClick = () => {
    if (!acceptedTerms) {
      addToast({
        title: "Terms & Conditions Required",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive",
        duration: 2500,
      });
      return;
    }

    if (!isGuestDetailsComplete()) {
      addToast({
        title: "Guest Details Required",
        description: "Please provide primary guest contact details.",
        duration: 2000,
      });
      setIsBookingDetailsOpen(true);
      return;
    }

    handleProceedToPayment();
  };

  const handleProceedToPayment = async () => {
    setIsBookingDetailsOpen(false);
    setloading(true);

    if (finalPayableTotal === null || finalPayableTotal === undefined || finalPayableTotal <= 0) {
      addToast({
        title: "Invalid Amount",
        description: "Please check your stay dates and accommodation selection.",
        variant: "destructive",
        duration: 2000,
      });
      setloading(false);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!checkInDate || !checkOutDate) {
      addToast({
        title: "Dates Required",
        description: "Please select your stay check-in and check-out dates.",
        variant: "destructive",
        duration: 2500,
      });
      setloading(false);
      return;
    }

    if (new Date(checkInDate).setHours(0, 0, 0, 0) < today.getTime()) {
      addToast({
        title: "Invalid Check-in Date",
        description: "Check-in date cannot be in the past. Please choose upcoming dates.",
        variant: "destructive",
        duration: 2500,
      });
      setloading(false);
      return;
    }

    if (new Date(checkOutDate).setHours(0, 0, 0, 0) <= new Date(checkInDate).setHours(0, 0, 0, 0)) {
      addToast({
        title: "Invalid Dates",
        description: "Check-out date must be at least one day after check-in date.",
        variant: "destructive",
        duration: 2500,
      });
      setloading(false);
      return;
    }

    // Availability re-check before opening Razorpay
    try {
      if (normalizedType === "villa") {
        const avail = await Checkvillaavailability({
          propertyId,
          checkIn: checkInDate?.toISOString(),
          checkOut: checkOutDate?.toISOString(),
        });
        if (avail && avail.available === false) {
          addToast({
            title: "Dates Unavailable",
            description:
              avail.message || "This villa is no longer available for the selected dates.",
            variant: "destructive",
            duration: 2500,
          });
          setloading(false);
          return;
        }
      } else if (normalizedType === "camping") {
        const requestedTents = Object.entries(reduxSelectedTents).map(
          ([type, t]) => ({
            tentType: type,
            quantity: t.quantity,
          })
        );
        const avail = await Getcampingavability({
          propertyId,
          checkIn: checkin,
          checkOut: checkout,
          tents: requestedTents,
        });
        if (avail && avail.available === false) {
          addToast({
            title: "Tents Unavailable",
            description:
              avail.message || "Selected tents are no longer available for these dates.",
            variant: "destructive",
            duration: 2500,
          });
          setloading(false);
          return;
        }
      } else if (normalizedType === "cottage") {
        const requestedCottages = Object.entries(reduxSelectedCottages).map(
          ([type, c]) => ({
            cottageType: type,
            quantity: c.quantity,
          })
        );
        const avail = await Getcottageavability({
          propertyId,
          checkIn: checkin,
          checkOut: checkout,
          cottages: requestedCottages,
        });
        if (avail && avail.available === false) {
          addToast({
            title: "Cottages Unavailable",
            description:
              avail.message ||
              "Selected cottages are no longer available for these dates.",
            variant: "destructive",
            duration: 2500,
          });
          setloading(false);
          return;
        }
      } else if (normalizedType === "hotel") {
        const requestedRooms = Object.values(reduxSelectedRooms).map((r) => ({
          roomType: r.typeName || r.name,
          quantity: r.quantity,
        }));
        const avail = await Gethotelavability({
          propertyId,
          checkIn: checkin,
          checkOut: checkout,
          rooms: requestedRooms,
        });
        if (avail && avail.available === false) {
          addToast({
            title: "Rooms Unavailable",
            description:
              avail.message || "Selected rooms are no longer available for these dates.",
            variant: "destructive",
            duration: 2500,
          });
          setloading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Availability verification check warning:", e);
    }

    // Synchronized items payload where sum(item.totalPrice) === basePrice
    let items = [];

    if (normalizedType === "villa") {
      items = [
        {
          unitType: "VillaUnit",
          unitId: propertyId,
          unitName: property?.name,
          quantity: 1,
          pricePerNight: Math.round(basePrice / nights),
          nights: nights,
          totalPrice: basePrice,
        },
      ];
    } else if (normalizedType === "camping") {
      items = Object.entries(reduxSelectedTents).map(([tentType, t]) => {
        const tentTotal =
          t.quantity *
          calculateBasePriceForRange(
            checkin,
            checkout,
            {
              weekdayPrice: t.weekdayPrice,
              weekendPrice: t.weekendPrice,
            },
            holidayDates
          );
        return {
          unitType: "Tent",
          unitId: t.unitId || t._id,
          typeName: tentType,
          quantity: t.quantity,
          pricePerNight: t.weekdayPrice,
          totalPrice: tentTotal,
        };
      });
    } else if (normalizedType === "cottage") {
      items = Object.entries(reduxSelectedCottages).map(([cottageType, c]) => {
        const cottageTotal =
          c.quantity *
          calculateBasePriceForRange(
            checkin,
            checkout,
            {
              weekdayPrice: c.weekdayPrice,
              weekendPrice: c.weekendPrice,
            },
            holidayDates
          );
        return {
          unitType: "CottageUnit",
          unitId: c.unitId || c._id,
          typeName: cottageType,
          quantity: c.quantity,
          pricePerNight: c.weekdayPrice,
          totalPrice: cottageTotal,
        };
      });
    } else if (normalizedType === "hotel") {
      items = Object.values(reduxSelectedRooms).map((room) => {
        const roomTotal =
          Number(room.quantity) *
          calculateBasePriceForRange(
            checkin,
            checkout,
            {
              weekdayPrice: room.weekdayPrice,
              weekendPrice: room.weekendPrice,
            },
            holidayDates
          );
        return {
          unitType: "RoomUnit",
          unitId: room.unitId || room.roomTypeId || room._id,
          typeName: room.typeName,
          quantity: Number(room.quantity),
          pricePerNight: Number(room.weekdayPrice),
          totalPrice: roomTotal,
        };
      });
    }

    const customerId =
      getCustomerId() ||
      customerDetails?.id ||
      customerDetails?.customerId ||
      customerDetails?._id ||
      null;

    let deviceId = null;
    try {
      deviceId = await getDeviceId();
    } catch (err) {
      deviceId = null;
    }

    const couponCode = appliedCoupon?.code || "";
    const couponId =
      appliedCoupon?.couponId ||
      appliedCoupon?._id ||
      appliedCoupon?.id ||
      null;

    const normalizedPropertyType =
      normalizedType === "cottage"
        ? "Cottages"
        : normalizedType === "hotel"
        ? "Hotels"
        : normalizedType === "camping"
        ? "Camping"
        : normalizedType === "villa"
        ? "Villa"
        : propertyType;

    const bookingData = {
      propertyType: normalizedPropertyType,
      propertyId,
      ownerId,
      customerId: customerId,
      customerDetails: customerDetails,
      checkIn: checkInDate?.toISOString(),
      checkOut: checkOutDate?.toISOString(),
      guests: {
        adults: guestCounts.adults,
        children: guestCounts.children,
        infants: guestCounts.infants,
      },
      items,
      paymentAmount: Number(finalPayableTotal || 0),
      couponCode: couponCode,
      paymentType: "full",
      partialPercentage: 30,
      taxRate: 18,
      deviceId,
      couponId,
      specialRequests: specialRequests || "",
      hasEvent: !!selectedEvent,
      eventDetails: selectedEvent
        ? {
            eventId: selectedEvent._id,
            eventTitle: selectedEvent.title,
            eventType: selectedEvent.eventType,
            eventDate: selectedEvent.startDate,
            attendees: eventAttendees,
            pricePerPerson: Number(selectedEvent.pricePerPerson) || 0,
            totalExtraCharge: eventExtraCharge,
          }
        : null,
      hasMealPackage: isMealPackageSelected,
      mealDetails: isMealPackageSelected
        ? {
            packageName: "All-Day Meal Package",
            adultCount: adultsCount,
            childCount: childrenCount,
            adultPricePerDay: adultMealPrice,
            childPricePerDay: childMealPrice,
            numberOfDays: mealNights,
            totalMealCharge: totalMealCharge,
            includedMeals: property?.foodOptions?.available || [],
            note: property?.foodOptions?.note || "",
          }
        : null,
    };

    try {
      const response = await Createbooking(bookingData);
      if (response?.success === true) {
        if (response?.data?.booking?.customerId) {
          try {
            localStorage.setItem(
              "thevilla_user_id",
              response.data.booking.customerId
            );
            localStorage.setItem(
              "customer_id",
              response.data.booking.customerId
            );
          } catch {}
        }
        const Bookingid = response?.data?.booking._id;
        const orderData = response.data.order;

        const razorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData?.amount,
          currency: "INR",
          name: "THE VILLA CAMP",
          description: `Booking for ${property?.name || "THE VILLA CAMP"}`,
          image:
            "https://res.cloudinary.com/db60uwvhk/image/upload/v1755287276/My%20Brand/Logo2_wkqqgs.png",
          order_id: orderData?.id,
          handler: async function (res) {
            try {
              const verifyResponse = await Verifybooking({
                razorpayPaymentId: res.razorpay_payment_id,
                razorpayOrderId: res.razorpay_order_id,
                razorpaySignature: res.razorpay_signature,
                bookingId: Bookingid,
              });
              if (verifyResponse?.success) {
                setloading(false);
                setOpensuccesmodal(true);
              } else {
                addToast({
                  title: "Payment Failed",
                  description: "Payment verification failed. Please contact support.",
                  variant: "destructive",
                  duration: 3000,
                });
                setloading(false);
              }
            } catch (error) {
              console.error("Verification Error:", error);
              addToast({
                title: "Payment Verification Failed",
                description:
                  "There was an issue verifying your payment. Please try again.",
                variant: "destructive",
                duration: 3000,
              });
              setloading(false);
            }
          },
          prefill: {
            name: `${customerDetails.firstName || ""} ${customerDetails.lastName || ""}`.trim(),
            email: customerDetails.email || "",
            contact: customerDetails.mobile || "",
          },
          theme: {
            color: "#ff6900",
          },
          modal: {
            ondismiss: function () {
              addToast({
                title: "Reservation Saved in My Bookings",
                description: "Your booking is held for 20 minutes. You can complete payment anytime from My Bookings or via the payment link sent to your WhatsApp.",
                variant: "warning",
                duration: 5000,
              });
              setloading(false);
              if (Bookingid) {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8086";
                fetch(`${apiBase}/api/v1/Booking/abandoned/${Bookingid}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                }).catch((err) => console.warn("Abandoned alert trigger error:", err));
              }
            },
          },
        };

        const razorpay = new window.Razorpay(razorpayOptions);
        razorpay.open();
      } else {
        addToast({
          title: "Booking Failed",
          description: response?.message || "An error occurred creating booking.",
          variant: "destructive",
          duration: 3000,
        });
        setloading(false);
      }
    } catch (error) {
      console.error("Booking Error:", error);
      addToast({
        title: "Booking Error",
        description: "Failed to initiate booking. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      setloading(false);
    }
  };

  if (opensucessmodal) {
    return (
      <div className="flex justify-center items-center w-full min-h-[70vh] px-4">
        <Successmodal />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
          <p className="text-sm font-medium text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  const categoryLabel =
    normalizedType === "camping"
      ? "Camping Retreat"
      : normalizedType === "cottage"
      ? "Luxury Cottage"
      : normalizedType === "hotel"
      ? "Boutique Stay"
      : "Luxury Villa";

  return (
    <div className="md:hidden block min-h-screen bg-[#f8f9fa] text-gray-900 pb-20">
      {/* 1. Mobile Top Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-700" />
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">
              Confirm & Book
            </h1>
            <p className="text-[11px] text-gray-500">
              {property?.name ? property.name.slice(0, 24) + (property.name.length > 24 ? "..." : "") : "Checkout"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[10px] font-semibold text-emerald-700 tracking-wide uppercase">
            Secure
          </span>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3.5">
        {/* 2. Property Card */}
        <div className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
            <Image
              src={property?.images?.[0] || "/placeholder.jpg"}
              alt={property?.name || "Property preview"}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-50 text-[#ff6900] text-[10px] font-bold tracking-wide uppercase mb-1">
              <Sparkles className="w-3 h-3" />
              {categoryLabel}
            </div>
            <h2 className="text-sm font-bold text-gray-900 truncate">
              {property?.name || "Property Name"}
            </h2>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
              {property?.address?.city || "Scenic Location"},{" "}
              {property?.address?.state || "India"}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-[11px] font-bold text-amber-700">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                4.92
              </div>
              <span className="text-[11px] text-gray-400">•</span>
              <span className="text-[11px] font-medium text-gray-600">
                Top Rated Stay
              </span>
            </div>
          </div>
        </div>

        {/* 3. Stay Details Card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#ff6900]" />
              Stay Dates & Guests
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-orange-50 text-[#ff6900] text-[11px] font-bold">
              {nights} {nights === 1 ? "Night" : "Nights"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-xl bg-gray-50/80 border border-gray-100">
              <p className="text-[11px] font-medium text-gray-500 mb-0.5">Check-in</p>
              <p className="text-xs font-bold text-gray-900">{formatDate(checkInDate)}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">From 2:00 PM</p>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50/80 border border-gray-100">
              <p className="text-[11px] font-medium text-gray-500 mb-0.5">Check-out</p>
              <p className="text-xs font-bold text-gray-900">{formatDate(checkOutDate)}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Until 11:00 AM</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#ff6900]">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">
                  {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
                </p>
                <p className="text-[11px] text-gray-500">
                  {guestCounts.adults} Adults
                  {guestCounts.children > 0 ? `, ${guestCounts.children} Children` : ""}
                  {guestCounts.infants > 0 ? `, ${guestCounts.infants} Infants` : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Unit breakdown chips for Camping / Cottage / Hotel */}
          {normalizedType === "camping" && Object.keys(reduxSelectedTents).length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Tent className="w-3.5 h-3.5 text-[#ff6900]" /> Selected Tents
              </p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(reduxSelectedTents).map(([type, t]) => (
                  <span
                    key={type}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-[11px] font-semibold"
                  >
                    {t.quantity}× {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {normalizedType === "cottage" && Object.keys(reduxSelectedCottages).length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-[#ff6900]" /> Selected Cottages
              </p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(reduxSelectedCottages).map(([type, c]) => (
                  <span
                    key={type}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-[11px] font-semibold"
                  >
                    {c.quantity}× {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {normalizedType === "hotel" && Object.keys(reduxSelectedRooms).length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Hotel className="w-3.5 h-3.5 text-[#ff6900]" /> Selected Rooms
              </p>
              <div className="flex flex-wrap gap-1.5">
                {Object.values(reduxSelectedRooms).map((r, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-[11px] font-semibold"
                  >
                    {r.quantity}× {r.typeName || "Room"}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Special Events & Experiences (Mobile) */}
        {activeEvents.length > 0 && (
          <PropertyEventSection
            events={activeEvents}
            selectedEventId={selectedEventId}
            onToggleSelect={(id) =>
              setSelectedEventId((prev) => (prev === id ? null : id))
            }
            onOpenDetails={(ev) => {
              setInspectingEvent(ev);
              setShowEventModal(true);
            }}
            attendees={eventAttendees}
            setAttendees={setEventAttendees}
            maxGuests={totalGuests}
            formatRupee={formatRupee}
          />
        )}

        {/* Meal Options Card (Mobile) */}
        {normalizedType === "camping" && property?.meals && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Campfire Dining Experience
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Freshly prepared local camp meals
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase">
                Included Free
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {property.meals.eveningSnacks && (
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Evening Snacks</span>
                  <span className="text-gray-800 font-medium text-[11px]">{property.meals.eveningSnacks}</span>
                </div>
              )}
              {property.meals.bbq?.available && (
                <div className="p-2.5 rounded-xl bg-orange-50/60 border border-orange-100">
                  <span className="text-[10px] font-bold text-orange-600 block uppercase flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500" /> Live BBQ
                  </span>
                  <span className="text-gray-800 font-medium text-[11px]">
                    {[property.meals.bbq.veg, property.meals.bbq.nonVeg].filter(Boolean).join(" & ") || "Veg & Non-Veg BBQ"}
                  </span>
                </div>
              )}
              {property.meals.dinner && (
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Buffet Dinner</span>
                  <span className="text-gray-800 font-medium text-[11px]">
                    {[property.meals.dinner.veg, property.meals.dinner.nonVeg].filter(Boolean).join(" & ") || "Unlimited Dinner"}
                  </span>
                </div>
              )}
              {property.meals.nextDayBreakfast && (
                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                  <span className="text-[10px] font-bold text-amber-700 block uppercase flex items-center gap-1">
                    <Coffee className="w-3 h-3 text-amber-500" /> Breakfast
                  </span>
                  <span className="text-gray-800 font-medium text-[11px]">{property.meals.nextDayBreakfast}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Villa / Cottage / Hotel Meal Options (Mobile) */}
        {normalizedType !== "camping" && property?.foodOptions && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    {adultMealPrice > 0 ? "All-Day Meal Package" : "Complimentary Meals"}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Freshly cooked home-style dining
                  </p>
                </div>
              </div>
              {adultMealPrice > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                  ₹{adultMealPrice}/adult/day
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase">
                  Included Free
                </span>
              )}
            </div>

            {/* Courses / Available Meals */}
            {Array.isArray(property.foodOptions.available) && property.foodOptions.available.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {property.foodOptions.available.map((course, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50/70 border border-amber-200/60 text-amber-900 text-[11px] font-medium"
                  >
                    <Check className="w-3 h-3 text-amber-600" />
                    {course}
                  </span>
                ))}
              </div>
            )}

            {/* Paid package breakdown & toggle */}
            {adultMealPrice > 0 && (
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <div className="bg-gray-50/80 p-2.5 rounded-xl border border-gray-100 text-[11px] text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>
                      Adults ({adultsCount} × {formatRupee(adultMealPrice)} × {mealNights}d):
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatRupee(adultMealPrice * adultsCount * mealNights)}
                    </span>
                  </div>
                  {childrenCount > 0 && (
                    <div className="flex justify-between">
                      <span>
                        Children ({childrenCount} × {childMealPrice > 0 ? `${formatRupee(childMealPrice)}` : "Free"} × {mealNights}d):
                      </span>
                      <span className="font-semibold text-gray-900">
                        {childMealPrice > 0 ? formatRupee(childMealPrice * childrenCount * mealNights) : "₹0"}
                      </span>
                    </div>
                  )}
                  {childMealPrice === 0 && (
                    <p className="text-[10px] text-emerald-600 font-medium">
                      Kids under 5 eat free with adults!
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  variant={isMealPackageSelected ? "default" : "outline"}
                  onClick={() => setIsMealPackageSelected(!isMealPackageSelected)}
                  className={`w-full h-9 rounded-xl text-xs font-semibold transition-all ${
                    isMealPackageSelected
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                      : "border-amber-300 text-amber-900 bg-amber-50/60 hover:bg-amber-100"
                  }`}
                >
                  {isMealPackageSelected ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Meal Package Added ({formatRupee(totalMealCharge)})
                    </span>
                  ) : (
                    <span>
                      + Add Meal Package (+{formatRupee(((adultMealPrice * adultsCount) + (childMealPrice * childrenCount)) * mealNights)})
                    </span>
                  )}
                </Button>
              </div>
            )}

            {property.foodOptions.note && (
              <p className="text-[10px] text-gray-400 italic pt-1">
                Note: {property.foodOptions.note}
              </p>
            )}
          </div>
        )}

        {/* 4. Primary Guest Contact Card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ff6900]" />
              Primary Guest Contact
            </h3>
            <button
              onClick={() => setIsBookingDetailsOpen(true)}
              className="text-xs font-bold text-[#ff6900] hover:text-[#e05d00] flex items-center gap-0.5"
            >
              {isGuestDetailsComplete() ? "Edit Details" : "Add Details"}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {isGuestDetailsComplete() ? (
            <div className="space-y-1.5 bg-gray-50/70 p-3 rounded-xl border border-gray-100">
              <p className="text-sm font-bold text-gray-900">
                {customerDetails?.firstName} {customerDetails?.lastName}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="truncate">{customerDetails?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span>+91 {customerDetails?.mobile}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsBookingDetailsOpen(true)}
              className="w-full py-3 px-3.5 rounded-xl border border-dashed border-orange-300 bg-orange-50/60 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#ff6900] flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    Add Guest Details
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Required for booking confirmation & check-in
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#ff6900] text-white text-xs font-semibold">
                Add
              </span>
            </button>
          )}
        </div>

        {/* 5. Coupons & Offers Card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          {appliedCoupon ? (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Check className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-emerald-900 uppercase tracking-wide truncate">
                    {appliedCoupon.code} Applied
                  </p>
                  <p className="text-[11px] font-semibold text-emerald-600">
                    You saved {formatRupee(discountAmount)} on this stay!
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveCouponClick}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 px-2 py-1 ml-2 flex-shrink-0"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCouponsDrawerOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-orange-50/70 to-amber-50/70 border border-orange-200/80 text-left transition-all active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#ff6900] text-white flex items-center justify-center shadow-sm">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    Apply Coupon or Promo Code
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Save extra on your stay with verified offers
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* 6. Detailed Price Breakdown */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Price Details
            </h3>
            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
              <Check className="w-3 h-3" /> Zero Convenience Fee
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-gray-600">
            {/* Base Rental Charges */}
            <div className="flex justify-between items-start">
              <div>
                <span className="font-medium text-gray-800">Rental Charges</span>
                {villaNightBreakdown && (
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">
                    {villaNightBreakdown.weekdays > 0 && (
                      <span>
                        {villaNightBreakdown.weekdays} weekday{villaNightBreakdown.weekdays > 1 ? "s" : ""}
                      </span>
                    )}
                    {villaNightBreakdown.weekdays > 0 &&
                      (villaNightBreakdown.weekends > 0 || villaNightBreakdown.holidays > 0) && (
                        <span>, </span>
                      )}
                    {villaNightBreakdown.weekends > 0 && (
                      <span>
                        {villaNightBreakdown.weekends} weekend{villaNightBreakdown.weekends > 1 ? "s" : ""}
                      </span>
                    )}
                    {villaNightBreakdown.holidays > 0 && (
                      <span>
                        {(villaNightBreakdown.weekdays > 0 || villaNightBreakdown.weekends > 0) && ", "}
                        {villaNightBreakdown.holidays} holiday
                      </span>
                    )}
                  </p>
                )}
                {!villaNightBreakdown && (
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    For {nights} {nights === 1 ? "night" : "nights"}
                  </p>
                )}
              </div>
              <span className="font-semibold text-gray-900">
                {formatRupee(basePrice)}
              </span>
            </div>

            {/* Discount row if coupon is applied */}
            {appliedCoupon && (
              <div className="flex justify-between items-center text-emerald-600">
                <span className="font-medium">Coupon Discount ({appliedCoupon.code})</span>
                <span className="font-bold">- {formatRupee(discountAmount)}</span>
              </div>
            )}

            {/* Event extra charge row if selected */}
            {selectedEvent && (
              <div className="flex justify-between items-center text-xs text-orange-800 bg-orange-50/80 p-2 rounded-xl border border-orange-200">
                <span className="font-semibold flex items-center gap-1 truncate max-w-[200px]">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                  {selectedEvent.title} ({eventAttendees} {eventAttendees === 1 ? "guest" : "guests"})
                </span>
                <span className="font-bold shrink-0">
                  {selectedEvent.isIncludedInStay || selectedEvent.pricePerPerson === 0 ? (
                    <span className="text-emerald-700">Free</span>
                  ) : (
                    `+ ${formatRupee(eventExtraCharge)}`
                  )}
                </span>
              </div>
            )}

            {/* Meal package extra charge row if selected */}
            {isMealPackageSelected && totalMealCharge > 0 && (
              <div className="flex justify-between items-center text-xs text-amber-800 bg-amber-50/80 p-2 rounded-xl border border-amber-200">
                <span className="font-semibold flex items-center gap-1 truncate max-w-[200px]">
                  <Utensils className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  All-Day Meals ({mealNights} {mealNights === 1 ? "day" : "days"})
                </span>
                <span className="font-bold shrink-0">
                  + {formatRupee(totalMealCharge)}
                </span>
              </div>
            )}

            {/* GST */}
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium text-gray-800">GST (18%)</span>
                <p className="text-[10px] text-gray-400">Government taxes</p>
              </div>
              <span className="font-semibold text-gray-900">
                {formatRupee(dynamicTaxAmount)}
              </span>
            </div>

            {/* Total Divider */}
            <div className="pt-2 border-t border-gray-100 flex justify-between items-baseline">
              <span className="text-sm font-bold text-gray-900">Total Payable</span>
              <div className="text-right">
                <span className="text-lg font-extrabold text-[#ff6900]">
                  {formatRupee(finalPayableTotal)}
                </span>
                <p className="text-[10px] text-gray-400">Inclusive of all taxes</p>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Special Requests Accordion */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <button
            onClick={() => setShowSpecialRequests(!showSpecialRequests)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-[#ff6900]" />
              <div>
                <p className="text-xs font-bold text-gray-900">
                  Any Special Requests?
                </p>
                <p className="text-[11px] text-gray-500">
                  Anniversary, birthday, food or arrival notes
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#ff6900]">
              {showSpecialRequests ? "Close" : "Add note"}
            </span>
          </button>

          {showSpecialRequests && (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
              <Textarea
                placeholder="Let us know if you're celebrating or have special requests..."
                value={specialRequests}
                onChange={(e) => dispatch(setSpecialRequests(e.target.value))}
                className="text-xs min-h-[90px] resize-none rounded-xl border-gray-200 focus:border-[#ff6900] focus:ring-[#ff6900]"
              />
              <p className="text-[10px] text-gray-400">
                We will do our best to accommodate your requests with the property host.
              </p>
            </div>
          )}
        </div>

        {/* 8. Policies & Terms Checkbox */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-gray-500" />
            Stay Policies
          </h3>

          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
              <p>Check-in: 2:00 PM • Check-out: 11:00 AM</p>
            </div>
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
              <p>Valid Govt. ID is required for all adult guests at check-in.</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
              <p>Standard cancellation policy applies to this stay reservation.</p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-start gap-2.5">
            <Checkbox
              id="terms-mobile"
              checked={acceptedTerms}
              onCheckedChange={(checked) => dispatch(setAcceptedTerms(Boolean(checked)))}
              className="mt-0.5 data-[state=checked]:bg-[#ff6900] data-[state=checked]:border-[#ff6900]"
            />
            <label
              htmlFor="terms-mobile"
              className="text-[11px] text-gray-600 leading-snug cursor-pointer select-none"
            >
              I agree to the{" "}
              <a href="#" className="font-semibold text-gray-900 underline underline-offset-2">
                House Rules
              </a>
              ,{" "}
              <a href="#" className="font-semibold text-gray-900 underline underline-offset-2">
                Cancellation Policy
              </a>
              , and{" "}
              <a href="#" className="font-semibold text-gray-900 underline underline-offset-2">
                Terms of Service
              </a>
              .
            </label>
          </div>
        </div>
      </div>

      {/* 9. Fixed Bottom Sticky Pay Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block leading-none mb-0.5">
              Total Payable
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-gray-900 leading-tight">
                {formatRupee(finalPayableTotal)}
              </span>
            </div>
            <span className="text-[10px] text-gray-500 block leading-tight mt-0.5">
              {nights} {nights === 1 ? "night" : "nights"} • {totalGuests} {totalGuests === 1 ? "guest" : "guests"}
            </span>
          </div>

          <Button
            onClick={handlePayClick}
            disabled={loadingg}
            className="flex-1 max-w-[150px] h-9 rounded-lg bg-gradient-to-r from-[#ff6900] to-[#ff8533] hover:from-[#e05d00] hover:to-[#ff6900] text-white font-semibold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 px-3"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Proceed to Pay</span>
          </Button>
        </div>

        <p className="text-[9px] text-center text-gray-400 mt-1 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          100% Safe & Secure Payment with Razorpay
        </p>
      </div>

      <Overlay isLoading={loadingg} />

      <Modal
        hideCloseButton={true}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={openmodel}
        onOpenChange={() => setopenmodal(!openmodel)}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-center font-bold">
            Dates Not Selected
          </ModalHeader>
          <ModalBody>
            <p className="text-xs text-gray-600 text-center">
              Please select check-in and check-out dates before proceeding to checkout.
            </p>
          </ModalBody>
          <ModalFooter className="flex justify-center items-center">
            <Button
              onClick={() => router.back()}
              className="px-8 py-2 rounded-xl w-44 bg-black text-white hover:bg-neutral-800 text-xs font-semibold uppercase tracking-wider"
            >
              Go Back
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <CouponsDrawer
        isOpen={isCouponsDrawerOpen}
        onClose={() => setIsCouponsDrawerOpen(false)}
        onApplyCoupon={handleApplyCoupon}
        appliedCoupon={appliedCoupon}
        propertyId={propertyId}
        propertyType={propertyType}
        subtotal={baseAmountForCoupon}
        checkIn={checkin}
        checkOut={checkout}
        nights={nights}
      />

      <BookingDetailsDrawer
        isOpen={isBookingDetailsOpen}
        onClose={() => setIsBookingDetailsOpen(false)}
        onPayNow={handleProceedToPayment}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setInspectingEvent(null);
        }}
        event={inspectingEvent}
        isSelected={selectedEventId === inspectingEvent?._id}
        onToggleSelect={(id) =>
          setSelectedEventId((prev) => (prev === id ? null : id))
        }
        attendees={eventAttendees}
        setAttendees={setEventAttendees}
        maxGuests={totalGuests}
        formatRupee={formatRupee}
      />
    </div>
  );
}
