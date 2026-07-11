"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import moment from "moment-timezone";
import confetti from "canvas-confetti";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

import {
  Share2,
  Calendar,
  Users,
  Utensils,
  Star,
  CheckCircle,
  Shield,
  Info,
  Ticket,
  Percent,
  ArrowRight,
} from "lucide-react";

import VerifyDetailsDialog from "@/components/Bookingcomponent/VerifyDetailsDialog";
import CouponsDrawer from "@/components/Propertyviewcomponents/coupons-drawer";
import Successmodal from "./Successmodal";
import Overlay from "./Overlay";

import { fetchproperty } from "@/Redux/Slices/propertiesSlice";
import {
  setAppliedCoupon,
  removeCoupon,
  setSpecialRequests,
  setAcceptedTerms,
} from "@/Redux/Slices/bookingSlice";
import { calculateBookingPrice } from "@/lib/bookingUtils";
import { calculateCampingTentTotal } from "@/lib/calculateTentBasePrice";
import { calculateCottageTotal } from "@/lib/calculateCottageBasePrice";
import { calculateHotelTotal } from "@/lib/calculateHotelBasePrice";
import { calculateBasePriceForRange } from "@/lib/datePricing";
import { Createbooking, Verifybooking } from "@/lib/API/Booking/Booking";
import { useToast } from "@/components/ui/toast-provider";
import { getDeviceId } from "@/lib/deviceId";

const PropertyBooking = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { addToast } = useToast();

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

  const reduxSelectedTents = useSelector((state) => state.booking.selectedTents);
  const reduxSelectedCottages = useSelector((state) => state.booking.selectedCottages);
  const reduxSelectedRooms = useSelector((state) => state.booking.selectedRooms);

  const dayTents = useSelector((state) => state.camping.dayDetails?.tents || []);
  const dayCottages = useSelector((state) => state.cottage.dayDetails?.cottages || []);
  const dayRooms = useSelector((state) => state.hotel.dayDetails?.rooms || []);

  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [isCouponsDrawerOpen, setIsCouponsDrawerOpen] = useState(false);
  const [openmodel, setopenmodal] = useState(false);
  const [loadingg, setloading] = useState(false);
  const [opensucessmodal, setOpensuccesmodal] = useState(false);

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

  const getCustomerId = () => {
    try {
      if (typeof window === "undefined") return null;
      const id =
        localStorage.getItem("thevilla_user_id") ||
        localStorage.getItem("customer_id") ||
        null;
      return id;
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
    adults: Number(selectedGuest?.adults ?? 2),
    children: Number(selectedGuest?.childrenn ?? 0),
    infants: Number(selectedGuest?.infants ?? 0),
  };

  const totalGuests = guestCounts.adults + guestCounts.children + guestCounts.infants;

  let baseAmountForCoupon = 0;
  let nightsForCoupon = nights;

  if (propertyType?.toLowerCase() === "camping") {
    baseAmountForCoupon = calculateCampingTentTotal(
      reduxSelectedTents,
      dayTents,
      checkin,
      checkout
    );
    nightsForCoupon = 1;
  } else if (propertyType?.toLowerCase() === "cottage") {
    baseAmountForCoupon = calculateCottageTotal(
      reduxSelectedCottages,
      dayCottages,
      checkin,
      checkout
    );
    nightsForCoupon = 1;
  } else if (propertyType?.toLowerCase() === "hotel") {
    baseAmountForCoupon = calculateHotelTotal(
      reduxSelectedRooms,
      dayRooms,
      checkin,
      checkout
    );
    nightsForCoupon = 1;
  } else {
    baseAmountForCoupon = calculateBasePriceForRange(
      checkInDate?.toISOString(),
      checkOutDate?.toISOString(),
      property?.pricing ?? {}
    );
  }

  const { basePrice, discountAmount, taxAmount, finalTotal } =
    calculateBookingPrice(baseAmountForCoupon, nightsForCoupon, appliedCoupon);

  const formatRupee = (amount) => {
    if (amount == null || Number.isNaN(Number(amount))) return "₹0";
    const formatted = new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Number(amount));
    return `₹${formatted}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleApplyCoupon = (coupon) => {
    dispatch(setAppliedCoupon(coupon));
    setIsCouponsDrawerOpen(false);
    confetti({ particleCount: 100, spread: 70, origin: { y: 1.2 } });
  };

  const handleRemoveCouponClick = () => {
    dispatch(removeCoupon());
  };

  const handleProceedToPayment = async () => {
    setloading(true);

    if (finalTotal === null || finalTotal === undefined) {
      addToast({
        title: "Total Amount is required",
        description: "Please check the amount before proceeding.",
        variant: "destructive",
        duration: 1000,
      });
      setloading(false);
      return;
    }

    let items = [];

    if (propertyType?.toLowerCase() === "villa") {
      items = [
        {
          unitType: "VillaUnit",
          unitId: propertyId,
          unitName: property?.name,
          quantity: 1,
          pricePerNight: Number(property?.pricing?.weekdayPrice),
          nights: nights,
          totalPrice: Number(property?.pricing?.weekdayPrice) * nights,
        },
      ];
    }
    if (propertyType?.toLowerCase() === "camping") {
      items = Object.entries(reduxSelectedTents).map(([tentType, t]) => ({
        unitType: "Tent",
        unitId: t.unitId,
        typeName: tentType,
        quantity: t.quantity,
        pricePerNight: t.weekdayPrice,
        totalPrice:
          t.quantity *
          calculateBasePriceForRange(checkin, checkout, {
            weekdayPrice: t.weekdayPrice,
            weekendPrice: t.weekendPrice,
          }),
      }));
    }
    if (propertyType?.toLowerCase() === "cottage") {
      items = Object.entries(reduxSelectedCottages).map(([cottageType, c]) => ({
        unitType: "CottageUnit",
        unitId: c.unitId,
        typeName: cottageType,
        quantity: c.quantity,
        pricePerNight: c.weekdayPrice,
        totalPrice:
          c.quantity *
          calculateBasePriceForRange(checkin, checkout, {
            weekdayPrice: c.weekdayPrice,
            weekendPrice: c.weekendPrice,
          }),
      }));
    }
    if (propertyType?.toLowerCase() === "hotel") {
      items = Object.values(reduxSelectedRooms).map((room) => ({
        unitType: "RoomUnit",
        unitId: room.unitId,
        typeName: room.typeName,
        quantity: Number(room.quantity),
        pricePerNight: Number(room.weekdayPrice),
        totalPrice:
          Number(room.quantity) *
          calculateBasePriceForRange(checkin, checkout, {
            weekdayPrice: room.weekdayPrice,
            weekendPrice: room.weekendPrice,
          }),
      }));
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

    const normalizedPropertyType =
      propertyType?.toLowerCase() === "cottage"
        ? "Cottages"
        : propertyType?.toLowerCase() === "hotel"
        ? "Hotels"
        : propertyType?.toLowerCase() === "camping"
        ? "Camping"
        : propertyType?.toLowerCase() === "villa"
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
      paymentAmount: Number(finalTotal || 0),
      couponCode: couponCode,
      paymentType: "full",
      partialPercentage: 30,
      taxRate: 18,
      deviceId,
      couponId,
    };

    try {
      const response = await Createbooking(bookingData);
      if (response?.success === true) {
        const Bookingid = response?.data?.booking._id;
        const orderData = response.data.order;
        var razorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData?.amount,
          currency: "INR",
          name: "THE VILLA CAMP",
          description: `Booking for THE VILLA CAMP`,
          image:
            "https://res.cloudinary.com/db60uwvhk/image/upload/v1755287276/My%20Brand/Logo2_wkqqgs.png",
          order_id: orderData?.id,
          handler: async function (response) {
            try {
              const verifyResponse = await Verifybooking({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                bookingId: Bookingid,
              });
              if (verifyResponse?.success) {
                setloading(false);
                setOpensuccesmodal(true);
              } else {
                addToast({
                  title: "Payment Failed",
                  description: "Verification failed.",
                  variant: "destructive",
                  duration: 1000,
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
                duration: 1000,
              });
              setloading(false);
            }
          },
          prefill: {
            name: `${customerDetails.firstName || ""} ${customerDetails.lastName || ""}`.trim(),
            email: customerDetails.email,
            contact: customerDetails.mobile,
          },
          theme: {
            color: "black",
          },
          modal: {
            ondismiss: function () {
              addToast({
                title: "Payment Cancelled",
                description: "You exited the payment process.",
                variant: "destructive",
                duration: 1000,
              });
              setloading(false);
            },
          },
        };

        const razorpay = new window.Razorpay(razorpayOptions);
        razorpay.open();
      } else {
        addToast({
          title: "Booking Failed",
          description: response?.message || "An error occurred.",
          variant: "destructive",
          duration: 1000,
        });
        setloading(false);
      }
    } catch (error) {
      console.error("Booking Error:", error);
      addToast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
        duration: 1000,
      });
      setloading(false);
    }
  };

  const getRoomsText = () => {
    if (propertyType === "Villa") {
      return "1 Villa";
    }
    if (propertyType === "Camping") {
      const count = Object.values(reduxSelectedTents).reduce((sum, t) => sum + t.quantity, 0);
      return `${count} ${count === 1 ? "Tent" : "Tents"}`;
    }
    if (propertyType === "Cottage") {
      const count = Object.values(reduxSelectedCottages).reduce((sum, c) => sum + c.quantity, 0);
      return `${count} ${count === 1 ? "Cottage" : "Cottages"}`;
    }
    if (propertyType === "Hotel") {
      const count = Object.values(reduxSelectedRooms).reduce((sum, r) => sum + r.quantity, 0);
      return `${count} ${count === 1 ? "Room" : "Rooms"}`;
    }
    return "1 Unit";
  };

  const handleCategoryClick = () => {
    if (propertyType) {
      router.push(`/category/${propertyType.toLowerCase()}`);
    }
  };

  const handlePropertyClick = () => {
    if (propertyType && propertyId) {
      const normalizedType = propertyType.charAt(0).toUpperCase() + propertyType.slice(1).toLowerCase();
      router.push(`/view-${normalizedType}/${propertyId}`);
    }
  };

  if (opensucessmodal) {
    return (
      <div className="flex justify-center items-center w-full h-[60vh] bg-background">
        <Successmodal />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white w-full">
        <div className="bg-black rounded-full flex justify-center items-center p-4">
          <Overlay isLoading={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background hidden md:block w-full text-black">
      {/* Header Breadcrumb */}
      <div className="border-b bg-card">
        <div className="w-full mx-auto px-6 py-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="text-primary hover:underline cursor-pointer" onClick={() => router.push("/")}>Home</span>
            <span className="mx-2">/</span>
            <span className="text-primary hover:underline cursor-pointer" onClick={handleCategoryClick}>
              {propertyType}s
            </span>
            <span className="mx-2">/</span>
            <span className="text-primary hover:underline cursor-pointer" onClick={handlePropertyClick}>
              {property?.name}
            </span>
            <span className="mx-2">/</span>
            <span>Payment</span>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Header */}
            <Card className="p-6 bg-white border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-black mb-1">
                    {property?.name || "Loading stay..."}
                  </h1>
                  <p className="text-gray-600">
                    {property?.address?.city && property?.address?.area
                      ? `${property?.address?.area}, ${property?.address?.city}`
                      : "Loading location..."}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                    <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                    <span className="font-semibold text-orange-700">5.0</span>
                    <span className="text-xs text-orange-600 ml-1">Guest Favourite!</span>
                  </div>
                </div>
              </div>
              {property?.images?.[0] && (
                <img
                  src={property.images[0]}
                  alt={property.name}
                  className="w-full h-80 object-cover rounded-lg mt-4 shadow-sm"
                />
              )}
            </Card>

            {/* Meals Included */}
            <Card className="p-6 bg-white border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-black">Meals Included In Your Booking</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg border border-green-100">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-green-700">Breakfast</span>
                </div>
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg border border-green-100">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-green-700">Lunch</span>
                </div>
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg border border-green-100">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-green-700">Dinner</span>
                </div>
              </div>
            </Card>

            {/* Booking Details */}
            <Card className="p-6 bg-white border border-gray-100 shadow-sm">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Check-in */}
                <div>
                  <h3 className="font-semibold text-gray-500 mb-2 uppercase text-xs tracking-wider">Check-In</h3>
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <Calendar className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-semibold text-black">{formatDate(checkInDate)}</p>
                      <p className="text-xs text-gray-500">(From 02:00 PM)</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto bg-orange-100 text-orange-700 hover:bg-orange-100">
                      For {nights} {nights === 1 ? "night" : "nights"}
                    </Badge>
                  </div>
                </div>

                {/* Check-out */}
                <div>
                  <h3 className="font-semibold text-gray-500 mb-2 uppercase text-xs tracking-wider">Check-Out</h3>
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <Calendar className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-semibold text-black">{formatDate(checkOutDate)}</p>
                      <p className="text-xs text-gray-500">(Until 11:00 AM)</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid md:grid-cols-2 gap-6">
                {/* Rooms */}
                <div>
                  <h3 className="font-semibold text-gray-500 mb-2 uppercase text-xs tracking-wider">Rooms & Units</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-sm font-semibold">
                      {getRoomsText().split(" ")[0]}
                    </div>
                    <span className="font-semibold text-black">{getRoomsText()}</span>
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <h3 className="font-semibold text-gray-500 mb-2 uppercase text-xs tracking-wider">Guests</h3>
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <Users className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <span className="font-semibold text-black">{totalGuests} Guests </span>
                      <span className="text-xs text-gray-500 block">
                        ({guestCounts.adults} Adults{guestCounts.children > 0 ? `, ${guestCounts.children} Children` : ""})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Meals Description */}
            <Card className="p-6 bg-white border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-black">Meals</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Wake up to a day full of delicious home-cooked vegetarian and non-vegetarian meals. 
                The package comprises lunch (the first meal after check-in), dinner, followed by breakfast (for the next day).
              </p>
              
              <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">All meals included in your booking package.</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Price Details */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-6 bg-white border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-black border-b pb-3">Price details</h2>
              
              <div className="space-y-4">
                <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                  <p className="text-green-700 font-semibold text-sm flex items-center gap-1.5">
                    💚 You pay zero convenience fees on your booking!
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      Rental Charges
                    </span>
                    <span className="font-semibold text-black">{formatRupee(basePrice)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-600 font-medium">Discount ({appliedCoupon.code})</span>
                      <span className="text-green-600 font-semibold">(-) {formatRupee(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      GST <span className="text-xs text-gray-500">(18% tax)</span>
                    </span>
                    <span className="font-semibold text-black">{formatRupee(taxAmount)}</span>
                  </div>
                </div>

                <Separator />

                {appliedCoupon ? (
                  <div className="p-3.5 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Percent className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-green-700 font-bold text-sm">{appliedCoupon.code}</p>
                        <p className="text-green-600 text-xs font-medium">Congrats! You applied the coupon code.</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 ml-auto h-8 px-2.5"
                        onClick={handleRemoveCouponClick}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsCouponsDrawerOpen(true)}
                    className="w-full p-3 bg-blue-50 hover:bg-blue-100/80 transition duration-200 border border-blue-100 rounded-lg flex items-center justify-between text-blue-700 text-sm font-semibold"
                  >
                    <span className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-blue-500" />
                      View coupons and offers
                    </span>
                    <ArrowRight className="w-4 h-4 text-blue-500" />
                  </button>
                )}

                <Separator />

                <div className="flex justify-between items-center text-lg font-bold text-black py-2">
                  <span>Total Payable</span>
                  <span>{formatRupee(finalTotal)}</span>
                </div>

                <div className="flex items-start gap-2.5 pt-4">
                  <Checkbox 
                    id="terms" 
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => dispatch(setAcceptedTerms(checked))}
                    className="mt-0.5 border-gray-300"
                  />
                  <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed cursor-pointer select-none">
                    I have read and accepted the{" "}
                    <span className="text-blue-600 hover:underline font-medium">Terms & Conditions</span>,{" "}
                    <span className="text-blue-600 hover:underline font-medium">Privacy Policies</span>,{" "}
                    <span className="text-blue-600 hover:underline font-medium">Cancellation Policy</span> and{" "}
                    <span className="text-blue-600 hover:underline font-medium">Indemnity Form</span>
                  </label>
                </div>

                <Button 
                  className="w-full bg-black hover:bg-gray-950 text-white py-6 rounded-lg font-semibold text-base mt-2 transition duration-200 disabled:opacity-50"
                  disabled={!acceptedTerms}
                  onClick={() => setShowVerifyDialog(true)}
                >
                  Continue
                </Button>

                <div className="flex items-center justify-center gap-2.5 pt-4 border-t border-gray-50">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-700 text-sm">100% Secure payment</p>
                    <p className="text-xs text-gray-500">Your details are safe with us</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      <VerifyDetailsDialog 
        open={showVerifyDialog} 
        onOpenChange={setShowVerifyDialog}
        onPayNow={handleProceedToPayment}
      />

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

      <Overlay isLoading={loadingg} />

      <Modal
        hideCloseButton={true}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={openmodel}
        onOpenChange={() => setopenmodal(!openmodel)}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-center font-bold text-black">
            Dates not selected
          </ModalHeader>
          <ModalBody className="text-gray-600 text-center text-sm">
            Please select check in and check out before proceeding to checkout.
          </ModalBody>
          <ModalFooter className="flex justify-center items-center">
            <Button
              onClick={() => router.back()}
              className="px-8 py-2 rounded bg-black text-white hover:bg-gray-800 uppercase font-medium text-sm transition duration-200"
            >
              Back
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PropertyBooking;