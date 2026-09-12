"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

import {
  Calendar,
  Users,
  Star,
  CheckCircle,
  Shield,
  ShieldCheck,
  Ticket,
  Percent,
  Tag,
  ArrowRight,
  MapPin,
  Sparkles,
  Utensils,
  Lock,
  Phone,
  Edit2,
  Home,
  Trees,
  Tent,
  Hotel,
  Clock,
  Check,
  CreditCard,
  ChevronRight,
  Info,
} from "lucide-react";

import VerifyDetailsDialog from "@/components/Bookingcomponent/VerifyDetailsDialog";
import CouponsSheet from "@/components/Propertyviewcomponents/coupons-sheet";
import Successmodal from "./Successmodal";
import Overlay from "./Overlay";
import Logo from "../../public/Productasset/mainlogo_clean.png";

import { fetchproperty } from "@/Redux/Slices/propertiesSlice";
import {
  setAppliedCoupon,
  removeCoupon,
  setSpecialRequests,
  setAcceptedTerms,
  setCustomerDetails,
} from "@/Redux/Slices/bookingSlice";
import { calculateBookingPrice } from "@/lib/bookingUtils";
import { calculateCampingTentTotal } from "@/lib/calculateTentBasePrice";
import { calculateCottageTotal } from "@/lib/calculateCottageBasePrice";
import { calculateHotelTotal } from "@/lib/calculateHotelBasePrice";
import {
  calculateBasePriceForRange,
  useHolidayDates,
} from "@/lib/pricingUtils";
import { Createbooking, Verifybooking } from "@/lib/API/Booking/Booking";
import { Checkvillaavailability } from "@/lib/API/category/Villa/Villa";
import { Getcampingavability } from "@/lib/API/category/Camping/Camping";
import { Getcottageavability } from "@/lib/API/category/Cottage/Cottage";
import { Gethotelavability } from "@/lib/API/category/Hotel/Hotel";
import { useToast } from "@/components/ui/toast-provider";
import { getDeviceId } from "@/lib/deviceId";

const PropertyBooking = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const holidayDates = useHolidayDates();

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
  const appliedCoupon = useSelector((state) => state.booking.appliedCoupon);

  const reduxSelectedTents = useSelector((state) => state.booking.selectedTents || {});
  const reduxSelectedCottages = useSelector((state) => state.booking.selectedCottages || {});
  const reduxSelectedRooms = useSelector((state) => state.booking.selectedRooms || {});

  const dayTents = useSelector((state) => state.camping?.dayDetails?.tents || []);
  const dayCottages = useSelector((state) => state.cottage?.dayDetails?.cottages || []);
  const dayRooms = useSelector((state) => state.hotel?.dayDetails?.rooms || []);

  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [isCouponsDrawerOpen, setIsCouponsDrawerOpen] = useState(false);
  const [openmodel, setopenmodal] = useState(false);
  const [loadingg, setloading] = useState(false);
  const [opensucessmodal, setOpensuccesmodal] = useState(false);

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
          if (!customerDetails?.mobile && u.mobile) updates.mobile = String(u.mobile).replace(/\D/g, "");
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

  const totalGuests = guestCounts.adults + guestCounts.children + guestCounts.infants;

  // 1. Precise Base Amount Calculation Across All Properties
  let baseAmountForCoupon = 0;
  const normalizedType = propertyType?.toLowerCase() || "";

  if (normalizedType === "camping") {
    const tentsCount = Object.values(reduxSelectedTents).reduce((sum, t) => sum + (t.quantity || 0), 0);
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
    const cottagesCount = Object.values(reduxSelectedCottages).reduce((sum, c) => sum + (c.quantity || 0), 0);
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
    const roomsCount = Object.values(reduxSelectedRooms).reduce((sum, r) => sum + (r.quantity || 0), 0);
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
        (Number(property?.pricing?.weekdayPrice) || Number(property?.basePricePerNight) || 1500) * nights;
    }
  }

  // 2. Uniform nightsForCoupon = 1 because baseAmountForCoupon ALREADY computes the full stay
  const { basePrice, discountAmount, taxAmount, finalTotal } =
    calculateBookingPrice(baseAmountForCoupon, 1, appliedCoupon);

  const formatRupee = (num) => {
    return `₹${Math.round(Number(num) || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleApplyCoupon = (coupon) => {
    dispatch(setAppliedCoupon(coupon));
    setIsCouponsDrawerOpen(false);
    confetti({ particleCount: 90, spread: 65, origin: { y: 0.8 } });
  };

  const handleRemoveCouponClick = () => {
    dispatch(removeCoupon());
  };

  const isGuestDetailsComplete = () => {
    return Boolean(
      customerDetails?.firstName?.trim() &&
      customerDetails?.lastName?.trim() &&
      customerDetails?.mobile?.trim() &&
      customerDetails?.email?.trim() &&
      customerDetails?.city?.trim()
    );
  };

  const handleProceedToPayment = async () => {
    setloading(true);

    if (finalTotal === null || finalTotal === undefined || finalTotal <= 0) {
      addToast({
        title: "Invalid Amount",
        description: "Please check your stay dates and accommodation selection.",
        variant: "destructive",
        duration: 2000,
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
            description: avail.message || "This villa is no longer available for the selected dates.",
            variant: "destructive",
            duration: 2500,
          });
          setloading(false);
          return;
        }
      } else if (normalizedType === "camping") {
        const requestedTents = Object.entries(reduxSelectedTents).map(([type, t]) => ({
          tentType: type,
          quantity: t.quantity,
        }));
        const avail = await Getcampingavability({
          propertyId,
          checkIn: checkin,
          checkOut: checkout,
          tents: requestedTents,
        });
        if (avail && avail.available === false) {
          addToast({
            title: "Tents Unavailable",
            description: avail.message || "Selected tents are no longer available for these dates.",
            variant: "destructive",
            duration: 2500,
          });
          setloading(false);
          return;
        }
      } else if (normalizedType === "cottage") {
        const requestedCottages = Object.entries(reduxSelectedCottages).map(([type, c]) => ({
          cottageType: type,
          quantity: c.quantity,
        }));
        const avail = await Getcottageavability({
          propertyId,
          checkIn: checkin,
          checkOut: checkout,
          cottages: requestedCottages,
        });
        if (avail && avail.available === false) {
          addToast({
            title: "Cottages Unavailable",
            description: avail.message || "Selected cottages are no longer available for these dates.",
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
            description: avail.message || "Selected rooms are no longer available for these dates.",
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

    // Prepare synchronized items payload where sum(item.totalPrice) === basePrice
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
          unitId: t.unitId,
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
          unitId: c.unitId,
          typeName: cottageType,
          quantity: c.quantity,
          pricePerNight: c.weekdayPrice,
          totalPrice: cottageTotal,
        };
      });
    } else if (normalizedType === "hotel") {
      items = Object.values(reduxSelectedRooms).map((room) => {
        const roomTotal =
          Number(room.quantity || 1) *
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
          unitId: room.unitId || room._id,
          typeName: room.typeName || room.name || room.roomType,
          quantity: Number(room.quantity || 1),
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
      console.warn("Unable to get device id", err);
    }

    const couponCode = appliedCoupon?.code || "";
    const couponId =
      appliedCoupon?.couponId ||
      appliedCoupon?._id ||
      appliedCoupon?.id ||
      null;

    const normalizedBackendPropertyType =
      normalizedType === "cottage"
        ? "Cottages"
        : normalizedType === "hotel"
        ? "Hotels"
        : normalizedType === "camping"
        ? "Camping"
        : "Villa";

    const bookingData = {
      propertyType: normalizedBackendPropertyType,
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
      paymentAmount: Number(finalTotal || 0),
      couponCode: couponCode,
      paymentType: "full",
      partialPercentage: 30,
      taxRate: 18,
      deviceId,
      couponId,
      specialRequests: specialRequests || "",
    };

    try {
      const response = await Createbooking(bookingData);
      if (response?.success === true) {
        const Bookingid = response?.data?.booking?._id;
        const orderData = response?.data?.order;

        if (response?.data?.booking?.customerId) {
          try {
            localStorage.setItem("thevilla_user_id", response.data.booking.customerId);
            localStorage.setItem("customer_id", response.data.booking.customerId);
          } catch {}
        }

        const razorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData?.amount,
          currency: "INR",
          name: "THE VILLA CAMP",
          description: `Booking for ${property?.name || "TheVillaCamp"}`,
          image:
            "https://res.cloudinary.com/db60uwvhk/image/upload/v1755287276/My%20Brand/Logo2_wkqqgs.png",
          order_id: orderData?.id,
          handler: async function (resp) {
            try {
              const verifyResponse = await Verifybooking({
                razorpayPaymentId: resp.razorpay_payment_id,
                razorpayOrderId: resp.razorpay_order_id,
                razorpaySignature: resp.razorpay_signature,
                bookingId: Bookingid,
              });
              if (verifyResponse?.success) {
                setloading(false);
                setOpensuccesmodal(true);
              } else {
                addToast({
                  title: "Payment Verification Failed",
                  description: "Payment was processed but verification failed. Please contact support.",
                  variant: "destructive",
                  duration: 3500,
                });
                setloading(false);
              }
            } catch (error) {
              console.error("Verification Error:", error);
              addToast({
                title: "Verification Error",
                description: "There was an issue verifying your payment. Please contact support.",
                variant: "destructive",
                duration: 3500,
              });
              setloading(false);
            }
          },
          prefill: {
            name: `${customerDetails?.firstName || ""} ${customerDetails?.lastName || ""}`.trim(),
            email: customerDetails?.email || "",
            contact: customerDetails?.mobile || "",
          },
          theme: {
            color: "#ff6900",
          },
          modal: {
            ondismiss: function () {
              addToast({
                title: "Payment Cancelled",
                description: "You cancelled the payment transaction.",
                variant: "destructive",
                duration: 2000,
              });
              setloading(false);
            },
          },
        };

        const razorpay = new window.Razorpay(razorpayOptions);
        razorpay.open();
      } else {
        addToast({
          title: "Booking Creation Failed",
          description: response?.message || "An error occurred while creating your booking order.",
          variant: "destructive",
          duration: 3000,
        });
        setloading(false);
      }
    } catch (error) {
      console.error("Booking Error:", error);
      addToast({
        title: "Error",
        description: "Failed to initialize booking. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      setloading(false);
    }
  };

  const getAccommodationSummary = () => {
    if (normalizedType === "camping") {
      const entries = Object.entries(reduxSelectedTents);
      if (entries.length === 0) return "1 Tent";
      return entries.map(([type, t]) => `${t.quantity}x ${type} Tent`).join(", ");
    }
    if (normalizedType === "cottage") {
      const entries = Object.entries(reduxSelectedCottages);
      if (entries.length === 0) return "1 Cottage Unit";
      return entries.map(([type, c]) => `${c.quantity}x ${type} Cottage`).join(", ");
    }
    if (normalizedType === "hotel") {
      const rooms = Object.values(reduxSelectedRooms);
      if (rooms.length === 0) return "1 Room Unit";
      return rooms.map((r) => `${r.quantity}x ${r.typeName || r.name || "Room"}`).join(", ");
    }
    return `Entire Villa (${property?.bhkType || "Entire Place"})`;
  };

  const getCategorySlug = () => {
    if (normalizedType.includes("camp")) return "campings";
    if (normalizedType.includes("cottage")) return "cottages";
    if (normalizedType.includes("hotel")) return "hotels";
    return "villas";
  };

  const getPropertyDetailRoute = () => {
    if (normalizedType.includes("camp")) return `/view-Camping/${propertyId}`;
    if (normalizedType.includes("cottage")) return `/view-Cottage/${propertyId}`;
    if (normalizedType.includes("hotel")) return `/view-Hotel/${propertyId}`;
    return `/view-Villa/${propertyId}`;
  };

  const getPropertyTypeLabel = () => {
    if (normalizedType.includes("camp")) return "Camping Experience";
    if (normalizedType.includes("cottage")) return "Nature Cottage";
    if (normalizedType.includes("hotel")) return "Boutique Resort / Hotel";
    return "Luxury Private Villa";
  };

  if (opensucessmodal) {
    return (
      <div className="flex justify-center items-center w-full min-h-[70vh] bg-neutral-50 py-12">
        <Successmodal />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white w-full">
        <div className="bg-black/90 rounded-full flex justify-center items-center p-4 shadow-xl">
          <Overlay isLoading={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/60 hidden md:block w-full text-neutral-900 pb-16">
      {/* 1. Header Bar: Brand Logo + Steps Indicator + Support */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="transition-transform hover:scale-[1.02]">
                <Image
                  src={Logo}
                  alt="TheVillaCamp"
                  width={124}
                  height={34}
                  priority
                  className="h-8 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Steps Indicator */}
            <div className="flex items-center gap-3 bg-neutral-100/80 px-4 py-1.5 rounded-full border border-neutral-200/60 text-xs font-semibold">
              <span className="text-neutral-500">1. Select Stay</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-[#ff6900] flex items-center gap-1 font-bold">
                <Lock className="w-3 h-3 text-[#ff6900]" />
                2. Review & Secure Checkout
              </span>
            </div>

            {/* Assistance Contact */}
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
              <div className="w-7 h-7 rounded-full bg-orange-50 text-[#ff6900] flex items-center justify-center">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Assistance</span>
                <span className="font-bold text-neutral-800">+91 91120 91114</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Breadcrumb Navigation */}
      <div className="bg-white border-b border-neutral-200/60 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-xs text-neutral-500">
            <Link href="/" className="hover:text-[#ff6900] transition-colors">
              Home
            </Link>
            <span className="mx-2 text-neutral-300">/</span>
            <Link
              href={`/category/${getCategorySlug()}`}
              className="hover:text-[#ff6900] transition-colors capitalize"
            >
              {getCategorySlug()}
            </Link>
            <span className="mx-2 text-neutral-300">/</span>
            <Link
              href={getPropertyDetailRoute()}
              className="hover:text-[#ff6900] transition-colors font-medium text-neutral-700 truncate max-w-xs"
            >
              {property?.name || "Stay Details"}
            </Link>
            <span className="mx-2 text-neutral-300">/</span>
            <span className="text-[#ff6900] font-semibold">Checkout</span>
          </div>
        </div>
      </div>

      {/* 3. Main 2-Column Checkout Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: Property Snapshot, Trip Details, Guest Contact, Meals, Policies */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card 1: Property Snapshot */}
            <Card className="p-6 bg-white border border-neutral-200/80 rounded-3xl shadow-xs overflow-hidden">
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <div className="relative w-full sm:w-44 h-32 rounded-2xl overflow-hidden shrink-0 bg-neutral-100 border border-neutral-100">
                  {property?.images?.[0] ? (
                    <img
                      src={property.images[0]}
                      alt={property?.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      <Home className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                    {property?.categoryName || propertyType || "Stay"}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-[#ff6900] border border-orange-200/60">
                      <Sparkles className="w-3 h-3" />
                      {getPropertyTypeLabel()}
                    </span>
                    <div className="flex items-center gap-1 text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200/60 font-semibold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{property?.averageRating || "4.9"}</span>
                      <span className="text-amber-600 text-[10px] font-normal">/5</span>
                    </div>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-neutral-900 truncate">
                    {property?.name || "Exclusive Luxury Stay"}
                  </h1>

                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                    <span className="truncate">
                      {property?.address?.area ? `${property.address.area}, ` : ""}
                      {property?.address?.city || "Maharashtra, India"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-neutral-600">
                    <span className="font-semibold text-neutral-800">{getAccommodationSummary()}</span>
                    <span>•</span>
                    <Link
                      href={getPropertyDetailRoute()}
                      className="text-[#ff6900] hover:underline font-semibold text-xs inline-flex items-center gap-0.5"
                    >
                      View property details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </Card>

            {/* Card 2: Trip Highlights & Inclusions */}
            <Card className="p-6 bg-white border border-neutral-200/80 rounded-3xl shadow-xs">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-5">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Your Stay Itinerary</h2>
                  <p className="text-xs text-neutral-500">Confirmed dates, timings, and reserved accommodation</p>
                </div>
                <Badge className="bg-orange-50 text-[#ff6900] border-orange-200/70 font-bold px-3 py-1 rounded-full text-xs">
                  {nights} {nights === 1 ? "Night" : "Nights"} Stay
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Check In */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-150 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Check-In</span>
                    <Calendar className="w-4 h-4 text-[#ff6900]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900">{formatDate(checkInDate)}</div>
                    <div className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>From 02:00 PM</span>
                    </div>
                  </div>
                </div>

                {/* Check Out */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-150 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Check-Out</span>
                    <Calendar className="w-4 h-4 text-[#ff6900]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900">{formatDate(checkOutDate)}</div>
                    <div className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>Until 11:00 AM</span>
                    </div>
                  </div>
                </div>

                {/* Guests */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-150 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Guests</span>
                    <Users className="w-4 h-4 text-[#ff6900]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900">{totalGuests} Guests</div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {guestCounts.adults} Adults{guestCounts.children > 0 ? `, ${guestCounts.children} Children` : ""}
                      {guestCounts.infants > 0 ? `, ${guestCounts.infants} Infants` : ""}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reserved Accommodations pill list */}
              <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-600">Reserved Units:</span>
                <span className="font-bold text-neutral-900 bg-orange-50/70 border border-orange-200/60 px-3 py-1 rounded-full text-[#ff6900]">
                  {getAccommodationSummary()}
                </span>
              </div>
            </Card>

            {/* Card 3: Primary Guest Information */}
            <Card className="p-6 bg-white border border-neutral-200/80 rounded-3xl shadow-xs">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Primary Guest & Contact</h2>
                  <p className="text-xs text-neutral-500">Booking confirmation & key access details will be sent here</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVerifyDialog(true)}
                  className="rounded-full border-neutral-300 text-xs font-bold hover:border-[#ff6900] hover:text-[#ff6900] flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  {isGuestDetailsComplete() ? "Edit Details" : "Add Details"}
                </Button>
              </div>

              {isGuestDetailsComplete() ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-orange-50/40 border border-orange-100/80 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">Lead Guest</span>
                    <span className="font-bold text-neutral-900 mt-0.5 block truncate">
                      {customerDetails.firstName} {customerDetails.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">Mobile</span>
                    <span className="font-bold text-neutral-900 mt-0.5 block truncate">
                      +91 {customerDetails.mobile}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">Email</span>
                    <span className="font-bold text-neutral-900 mt-0.5 block truncate">
                      {customerDetails.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">City</span>
                    <span className="font-bold text-neutral-900 mt-0.5 block truncate">
                      {customerDetails.city}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setShowVerifyDialog(true)}
                  className="p-4 rounded-2xl border border-dashed border-orange-300 bg-orange-50/40 flex items-center justify-between cursor-pointer hover:bg-orange-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#ff6900] text-white flex items-center justify-center font-bold text-sm">
                      !
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">Guest details incomplete</p>
                      <p className="text-xs text-neutral-500">Click to fill your name, phone number & email for booking confirmation.</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-[#ff6900] hover:bg-[#e05d00] text-white rounded-xl text-xs font-bold">
                    Enter Details
                  </Button>
                </div>
              )}
            </Card>

            {/* Card 4: Meals Inclusions */}
            <Card className="p-6 bg-white border border-neutral-200/80 rounded-3xl shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-neutral-900">Complimentary Meals Package</h2>
                    <p className="text-xs text-neutral-500">Delicious home-style vegetarian & non-vegetarian culinary options</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
                  Included in Stay
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs font-bold text-emerald-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Breakfast</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs font-bold text-emerald-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Lunch</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs font-bold text-emerald-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Evening Tea</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs font-bold text-emerald-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dinner</span>
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
                Enjoy authentic local flavours cooked fresh at the property. Special culinary and dietary preferences can be communicated directly with the villa caretaker upon arrival.
              </p>
            </Card>

            {/* Card 5: Special Requests */}
            <Card className="p-6 bg-white border border-neutral-200/80 rounded-3xl shadow-xs">
              <h2 className="text-base font-bold text-neutral-900 mb-1">Any Special Requests?</h2>
              <p className="text-xs text-neutral-500 mb-3">
                Let us know if you are celebrating an occasion (Birthday, Anniversary, Family Reunion) or have specific arrival instructions.
              </p>
              <Textarea
                placeholder="Write your special requests here (e.g. Birthday decoration, late check-in request, Jain food requirements)..."
                value={specialRequests || ""}
                onChange={(e) => dispatch(setSpecialRequests(e.target.value))}
                className="w-full min-h-[90px] rounded-2xl border-neutral-200 text-sm focus:border-[#ff6900] focus:ring-2 focus:ring-[#ff6900]/20 resize-none p-3.5"
              />
            </Card>

            {/* Card 6: Cancellation Policy & Stay Rules */}
            <Card className="p-6 bg-white border border-neutral-200/80 rounded-3xl shadow-xs">
              <div className="flex items-center gap-2 text-base font-bold text-neutral-900 mb-3">
                <ShieldCheck className="w-5 h-5 text-[#ff6900]" />
                <h2>Cancellation Policy & Guidelines</h2>
              </div>
              <div className="space-y-2.5 text-xs text-neutral-600">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff6900] mt-1.5 shrink-0" />
                  <span>
                    <strong>Free Cancellation:</strong> Cancel up to 48 hours before check-in date for a 100% full refund.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>Standard Check-in:</strong> 02:00 PM. <strong>Check-out:</strong> 11:00 AM.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 shrink-0" />
                  <span>
                    Government ID (Aadhaar / Passport / Driving License) is mandatory for all adult guests during check-in.
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: Sticky Order Summary, Coupon & Razorpay Pay CTA */}
          <div className="lg:col-span-1 sticky top-24 self-start">
            <Card className="bg-white border border-neutral-200/90 rounded-3xl shadow-lg shadow-neutral-200/50 p-6 space-y-5">
              <div className="border-b border-neutral-100 pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-neutral-900">Price Summary</h2>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                    Zero Convenience Fee
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Includes all stay charges, meal package & applicable taxes
                </p>
              </div>

              {/* Price Line Items */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-neutral-700">
                  <span>Stay Charges ({nights} {nights === 1 ? "night" : "nights"})</span>
                  <span className="font-bold text-neutral-900">{formatRupee(basePrice)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between items-center text-emerald-600 bg-emerald-50/70 px-3 py-2 rounded-xl border border-emerald-200/60">
                    <span className="flex items-center gap-1.5 font-semibold text-xs">
                      <Tag className="w-3.5 h-3.5" />
                      Coupon Discount ({appliedCoupon.code})
                    </span>
                    <span className="font-black text-sm">(-) {formatRupee(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-neutral-700">
                  <span className="flex items-center gap-1 text-xs text-neutral-500">
                    GST & Hospitality Tax (18%)
                  </span>
                  <span className="font-bold text-neutral-900">{formatRupee(taxAmount)}</span>
                </div>
              </div>

              {/* Coupon Action Box */}
              <div className="pt-1">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="text-xs font-bold text-emerald-900">{appliedCoupon.code} Applied</div>
                        <div className="text-[11px] text-emerald-700">You saved {formatRupee(discountAmount)}!</div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveCouponClick}
                      className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 font-bold h-7 px-2"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsCouponsDrawerOpen(true)}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-orange-50/80 hover:bg-orange-100/70 border border-orange-200/80 text-[#ff6900] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <Ticket className="w-4 h-4 text-[#ff6900] group-hover:rotate-12 transition-transform" />
                      <span>View Coupons & Offers</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#ff6900]">
                      <span>Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                )}
              </div>

              <Separator className="bg-neutral-100" />

              {/* Total Payable */}
              <div className="flex justify-between items-baseline pt-1">
                <div>
                  <span className="text-sm font-bold text-neutral-900 block">Total Amount</span>
                  <span className="text-xs text-neutral-400">Inclusive of all taxes</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#ff6900] tracking-tight block">
                    {formatRupee(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2.5 pt-2">
                <Checkbox
                  id="terms-desktop"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => dispatch(setAcceptedTerms(Boolean(checked)))}
                  className="mt-0.5 border-neutral-300 data-[state=checked]:bg-[#ff6900] data-[state=checked]:border-[#ff6900]"
                />
                <label
                  htmlFor="terms-desktop"
                  className="text-[11px] text-neutral-500 leading-relaxed cursor-pointer select-none"
                >
                  I have read and accept the{" "}
                  <Link href="/terms-of-service" target="_blank" className="text-[#ff6900] hover:underline font-semibold">
                    Terms & Conditions
                  </Link>
                  ,{" "}
                  <Link href="/cancellation-policy" target="_blank" className="text-[#ff6900] hover:underline font-semibold">
                    Cancellation Policy
                  </Link>{" "}
                  and House Rules.
                </label>
              </div>

              {/* Pay Button */}
              <Button
                type="button"
                disabled={!acceptedTerms || loadingg}
                onClick={() => {
                  if (!isGuestDetailsComplete()) {
                    setShowVerifyDialog(true);
                  } else {
                    handleProceedToPayment();
                  }
                }}
                className="w-full py-4 h-auto rounded-2xl bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c84d00] text-white font-black text-base shadow-lg shadow-orange-500/25 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {loadingg ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Proceed to Pay {formatRupee(finalTotal)}</span>
                  </>
                )}
              </Button>

              {/* Security Footnote */}
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 pt-1">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] font-medium text-neutral-500">
                  256-bit SSL Encrypted | Powered by Razorpay
                </span>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Guest Details Modal */}
      <VerifyDetailsDialog
        open={showVerifyDialog}
        onOpenChange={setShowVerifyDialog}
        onPayNow={handleProceedToPayment}
      />


      {/* Loading Overlay */}
      <Overlay isLoading={loadingg} />

      {/* No Dates Selected Modal */}
      <Modal
        hideCloseButton={true}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={openmodel}
        onOpenChange={() => setopenmodal(!openmodel)}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-center font-bold text-neutral-900">
            Dates Not Selected
          </ModalHeader>
          <ModalBody className="text-neutral-600 text-center text-sm">
            Please select check-in and check-out dates before proceeding to checkout.
          </ModalBody>
          <ModalFooter className="flex justify-center items-center">
            <Button
              onClick={() => router.back()}
              className="px-8 py-2 rounded-xl bg-neutral-900 text-white hover:bg-black font-semibold text-sm transition duration-200"
            >
              Back to Stay
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Desktop Slide-In Coupons Sheet (Opens from Right) */}
      <CouponsSheet
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
    </div>
  );
};

export default PropertyBooking;