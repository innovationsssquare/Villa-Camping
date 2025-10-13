"use client";

import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaPhone,
  FaBell,
  FaUser,
  FaStar,
  FaCalendarAlt,
  FaUsers,
  FaBed,
  FaShieldAlt,
  FaPercent,
  FaInfoCircle,
  FaTimes,
  FaTicketAlt,
  FaArrowRight,
  FaGift,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import CouponsDrawer from "@/components/Propertyviewcomponents/coupons-drawer";
import BookingDetailsDrawer from "@/components/Bookingcomponent/booking-details-drawer";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment-timezone";
import { fetchproperty } from "@/Redux/Slices/propertiesSlice";
import Image from "next/image";
import {
  setAppliedCoupon,
  removeCoupon,
  setSpecialRequests,
  setAcceptedTerms,
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
  useDisclosure,
} from "@heroui/react";
import { useRouter } from "next/navigation";

export default function BookingPreviewScreen({ isOpen, onClose }) {
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
  const [openmodel, setopenmodal] = useState(false);
  const [open, setOpen] = useState(false);
  const [opensucessmodal, setOpensuccesmodal] = useState(false);
  const [loadingg, setloading] = useState(false);
  const [currentStep, setCurrentStep] = useState("overview");
  const [isCouponsDrawerOpen, setIsCouponsDrawerOpen] = useState(false);
  const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);
  const appliedCoupon = useSelector((state) => state.booking.appliedCoupon);
  const { addToast } = useToast();
  const router = useRouter();
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
    // booking slice uses `childrenn` key; map it here safely
    children: Number(selectedGuest?.childrenn ?? 0),
    infants: Number(selectedGuest?.infants ?? 0),
  };

  const totalGuests =
    guestCounts.adults + guestCounts.children + guestCounts.infants;

  useEffect(() => {
    if (categoryId && propertyId) {
      dispatch(fetchproperty({ categoryId, propertyId }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!categoryId & !propertyId) {
      setopenmodal(true);
    }
  }, []);

  const { discountAmount, finalTotal } = calculateBookingPrice(
    property?.pricing?.weekdayPrice,
    nights,
    appliedCoupon
  );

  const handleNext = () => {
    if (currentStep === "overview") {
      setCurrentStep("policy");
    } else if (currentStep === "policy") {
      setCurrentStep("price");
    }
  };

  const handleBack = () => {
    if (currentStep === "policy") {
      setCurrentStep("overview");
    } else if (currentStep === "price") {
      setCurrentStep("policy");
    } else if (currentStep === "overview") {
      router.back();
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
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

  const handleContinue = () => {
    setIsBookingDetailsOpen(true);
  };

  
  const handleProceedToPayment = async () => {
    setloading(true);
    // if (!agreed) {
    //   toast({
    //     title: "Accept All The Conditions",
    //     description: "Please agree to the conditions before proceeding.",
    //     action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
    //   });
    //   setloading(false);
    //   return;
    // }
    if (finalTotal === null) {
      addToast({
        title: "Total Amount is required",
        description: "Please check  the amount before proceeding.",
        variant: "destructive",
        duration: 1000,
      });
      setloading(false);
      return;
    }

    // const encodedUserData = Cookies.get("User");

    // if (!encodedUserData) {
    //   return null;
    // }
    // const decodedUserData = decodeURIComponent(encodedUserData);
    // const userData = JSON.parse(decodedUserData);

    const bookingData = {
      propertyType,
      propertyId,
      ownerId,
      customerId: "6833656360ed0e90157dd2e1",
      customerDetails: customerDetails,
      checkIn: checkInDate?.toISOString(),
      checkOut: checkOutDate?.toISOString(),
      guests: {
        adults: guestCounts.adults,
        children: guestCounts.children,
        infants: guestCounts.infants,
      },
      // items,
      paymentAmount: Number(finalTotal || 0),
      // You can also send appliedCoupon if server uses it for validation
      // appliedCoupon: appliedCoupon?.code || null,
    };
    setIsBookingDetailsOpen(false);
    try {
      const response = await Createbooking(bookingData);
      setOpen(!open);
      if (response?.success === true) {
        const Bookingid = response?.data?._id;
        var razorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: response.order?.amount,
          currency: "INR",
          name: "THE VILLA CAMP",
          description: `Booking for  THE VILLA CAMP`,
          // notes: {
          //   paymentOption: selectedOption,
          //   // amountSummary: `${selectedOption === "advance" ? `Advance: ₹${paymentAmount}` : `Full Payment: ₹${paymentAmount}`}`,
          // },
          image:
            "https://res.cloudinary.com/db60uwvhk/image/upload/v1755287276/My%20Brand/Logo2_wkqqgs.png",
          order_id: response.order?.id,
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
                // router.refresh("/checkout");
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
            name: customerDetails.fullName,
            email: customerDetails.email,
            contact: customerDetails.phone,
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

  if (opensucessmodal) {
    return (
      <div className="flex justify-center items-center w-full h-[50vh]">
        <Successmodal />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="bg-black rounded-full flex justify-center items-center">
          <ButtonLoader />
        </div>
      </div>
    );
  }

  const getStepNumber = () => {
    switch (currentStep) {
      case "overview":
        return 1;
      case "policy":
        return 2;
      case "price":
        return 3;
      default:
        return 1;
    }
  };

  const renderOverview = () => (
    <div className="space-y-3">
      {/* Property Card */}
      <div className="border-gray-200 rounded-lg border bg-white p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-black mb-1">
              {property?.name}
            </h2>
            <p className="text-gray-600 mb-2 text-xs">
              {" "}
              {property?.address?.city}, {property?.address?.area}
            </p>
            <div className="flex items-center gap-2">
              <FaStar className="text-orange-500 w-4 h-4" />
              <span className="font-medium text-black">5</span>
              <span className="text-xs text-gray-600">Guest Favourite!</span>
            </div>
          </div>
          <div className="relative">
            <Image
              src={property?.images?.[0]}
              alt={property?.name}
              height={80}
              width={120}
              className="w-[120px] h-[80px] rounded-lg object-cover"
            />
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div className="border-gray-200 rounded-lg border  p-4">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-black">Trip Details</h3>
          <span className="bg-orange-100 text-orange-500 border border-orange-300 font-medium px-2 py-1 rounded text-xs">
            For {nights} {nights === 1 ? "night" : "nights"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6 w-full">
          <div>
            <p className="text-gray-600 text-sm mb-1">Check-In</p>
            <div className="flex items-start gap-2">
              <FaCalendarAlt className="text-black w-4 h-4 mt-2" />
              <div>
                <p className="font-medium text-black">
                  {formatDate(checkInDate)}
                </p>
                <p className="text-xs text-gray-500">(From 02:00 PM)</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Check-Out</p>
            <div className="flex items-start gap-2">
              <FaCalendarAlt className="text-black w-4 h-4 mt-2" />
              <div>
                <p className="font-medium text-black">
                  {formatDate(checkOutDate)}
                </p>
                <p className="text-xs text-gray-500">(Until 11:00 AM)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-gray-600 text-sm mb-1">Guests</p>
            <div className="flex items-center gap-2">
              <FaUsers className="text-black w-4 h-4" />
              <div>
                <p className="font-medium text-black">{totalGuests} Guests</p>
                <p className="text-xs text-gray-500">
                  ({selectedGuest?.adults} Adults )
                </p>
              </div>
            </div>
          </div>
          {/* <div>
            <p className="text-gray-600 text-sm mb-1">No. of Rooms</p>
            <div className="flex items-center gap-2">
              <FaBed className="text-black w-4 h-4" />
              <p className="font-medium text-black">1 Room</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );

  const renderPriceDetails = () => (
    <div className="space-y-6">
      {/* Price Details Card */}
      <div className="border-gray-200 rounded-lg border bg-white p-4">
        <h3 className="text-md font-semibold text-black mb-4">Price details</h3>

        {/* Zero Convenience Fee */}
        <div className="bg-[#FFFFFF4D] border border-gray-200 rounded-lg p-2 mb-4 flex items-center justify-between">
          <p className="text-black text-xs">
            You pay zero convenience fees on your booking!
          </p>
          <div className="bg-orange-100 rounded-full p-1">
            <FaInfoCircle className="w-3 h-3 text-orange-500" />
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-black">Rental Charges</span>
              <FaInfoCircle className="w-4 h-4 text-gray-400" />
            </div>
            <span className="font-medium text-black">
              ₹{property?.pricing?.weekdayPrice}
            </span>
          </div>

          {appliedCoupon && (
            <div className="flex justify-between items-center">
              <span className="text-green-600 text-xs">
                Discount ({appliedCoupon.code})
              </span>
              <span className="text-green-600 text-xs">
               - ₹{discountAmount.toLocaleString()} Discount applied!
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              <span className="text-black">GST</span>
              <span className="text-xs text-gray-500 ml-1">
                (As per government guidelines)
              </span>
            </div>
            <span className="font-medium text-black">₹{finalTotal}</span>
          </div>
        </div>

        {appliedCoupon && (
          <div className="bg-[#FFFFFF4D] border-gray-200 p-2 border rounded-lg  w-full  mb-4 flex items-center justify-between">
            <div className="flex items-center  gap-3">
              <div className="bg-green-500 rounded-full p-2">
                <FaPercent className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="font-medium text-sm text-black">
                  {appliedCoupon.code}
                </p>
                <p className="text-xs text-green-600">
                  Congrats you applied the offer
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleRemoveCouponClick}
            >
              Remove
            </Button>
          </div>
        )}

        <button
          onClick={() => setIsCouponsDrawerOpen(true)}
          className="flex items-center gap-2 mb-4 text-blue-500 hover:text-blue-600 transition-colors"
        >
          <FaTicketAlt className="w-4 h-4" />
          <span className="text-sm">View coupons and offers</span>
          <FaArrowRight className="w-3 h-3" />
        </button>

        <hr className="my-4" />

        <div className="flex justify-between items-center">
          <span className="text-md font-semibold text-black">
            Total Payable
          </span>
          <span className="text-md font-semibold text-black">
            ₹{finalTotal}
          </span>
        </div>
      </div>
    </div>
  );

  const renderCancellationPolicy = () => (
    <div className="space-y-3">
      {/* Cancellation Policy Card */}
      <div className="border-gray-200 rounded-lg border bg-white p-3">
        <h3 className="text-md font-semibold text-black mb-4">
          Booking & Cancellation policy
        </h3>

        {/* No Refund */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-orange-100 rounded-full p-2">
            <FaTimes className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <p className="font-medium text-black">No Refund</p>
            <p className="text-sm text-gray-600">On your selected dates</p>
          </div>
        </div>

        {/* Policy Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4 w-full">
          <Button
            variant="secondary"
            className="bg-orange-100 text-xs text-orange-500 hover:bg-orange-100"
          >
            Refund Policy
          </Button>
          <Button
            variant="secondary"
            className="bg-orange-100 text-xs text-orange-500 hover:bg-orange-100"
          >
            Home Rules and Policy
          </Button>
        </div>

        {/* Check-in/out Times */}
        <div className="mb-4">
          <p className="text-gray-700 mb-2 text-sm">
            <span className="font-medium">Check-in time: 2:00 PM</span>,{" "}
            <span className="font-medium">Check-out time: 11:00 AM</span>
          </p>
          <div className="flex items-start gap-2">
            <FaInfoCircle className="w-6 h-6 text-black mt-0.5" />
            <p className="text-xs text-gray-600">
              Early check-in and late check-out is subject to availability (at
              an additional fee)
            </p>
          </div>
        </div>

        {/* Terms Acceptance */}
        <div className="flex items-start gap-3 mb-4">
          <Checkbox
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked)}
            className="mt-1"
          />
          <div className="text-xs">
            <span className="text-gray-700">I have read and accepted the </span>
            <a href="#" className="text-blue-600 underline">
              Terms & Conditions
            </a>
            <span className="text-gray-700"> , </span>
            <a href="#" className="text-blue-600 underline">
              Privacy Policies
            </a>
            <span className="text-gray-700"> , </span>
            <a href="#" className="text-blue-600 underline">
              Cancellation Policy
            </a>
          </div>
        </div>
      </div>

      {/* Special Requests */}
      <div className="border-gray-200 rounded-lg border bg-white p-4">
        <div className="flex items-center gap-2 mb-3">
          <FaGift className="w-5 h-5 text-orange-500" />
          <h3 className="text-md font-semibold text-black">
            Any special requests?
          </h3>
        </div>

        <Textarea
          placeholder="(Birthday, Anniversary, Family getaway etc.)"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          className="mb-3 min-h-[120px] resize-none bg-[#FFFFFF4D] border-gray-200 border"
        />

        <p className="text-xs text-gray-600">
          {`Share your special requests with us and we'll do our best to
          accommodate them!`}
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#FFFFFF4D] backdrop-blur-2xl z-50 overflow-hidden md:hidden block">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-gray-200 px-2 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="p-2 border-gray-200 bg-white border"
              >
                <FaArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-md font-semibold text-black">
                  Booking overview
                </h1>
                <p className="text-xs text-gray-500">
                  Step {getStepNumber()} of 3
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-2 py-4">
          {currentStep === "overview" && renderOverview()}
          {currentStep === "price" && renderPriceDetails()}
          {currentStep === "policy" && renderCancellationPolicy()}
        </div>

        {/* Footer */}
        <div className="bg-[#FFFFFF4D] backdrop-blur-2xl ">
          {/* Security Badge */}
          <div className="bg-orange-100 text-orange-500 px-2 py-2 flex items-center justify-center gap-2 ">
            <FaShieldAlt className="w-4 h-4" />
            <span className="text-sm font-medium">100% Secure payment</span>
            {/* <span className="text-sm">Trusted by 5Lakh+ guests</span> */}
          </div>

          <div className="px-4 py-4 flex items-center justify-between">
            {currentStep === "price" ? (
              <>
                <div>
                  <p className="text-xl font-bold text-black">₹{finalTotal}</p>
                  <p className="text-sm text-gray-600">
                    ( For 2 nights,2 guests )
                  </p>
                </div>
                <Button
                  onClick={handleContinue}
                  className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-full"
                >
                  Continue
                </Button>
              </>
            ) : (
              <>
                <div>
                  <p className="text-xl font-bold text-black">₹{finalTotal}</p>
                  <p className="text-sm text-gray-600">
                    ( For {nights} nights, {totalGuests} guests )
                  </p>
                </div>
                <Button
                  onClick={handleNext}
                  className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-full"
                >
                  Next
                </Button>
              </>
            )}
          </div>
        </div>
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
          <ModalHeader className="flex flex-col gap-1 text-center">
            Dates not selected
          </ModalHeader>
          <ModalBody>
            <p className="text-xs ">
              Please select check in and check out before proceeding
            </p>
          </ModalBody>
          <ModalFooter className="flex justify-center items-center">
            <Button
              onClick={() => router.back()}
              className="px-8 py-0.5 rounded-sm w-48  border-none hover:bg-black bg-black dark:border-white uppercase text-white  transition duration-200 text-sm "
            >
              Back
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <CouponsDrawer
        isOpen={isCouponsDrawerOpen}
        onClose={() => setIsCouponsDrawerOpen(false)}
        onApplyCoupon={handleApplyCoupon}
        appliedCoupon={appliedCoupon}
      />

      <BookingDetailsDrawer
        isOpen={isBookingDetailsOpen}
        onClose={() => setIsBookingDetailsOpen(false)}
        onPayNow={handleProceedToPayment}
      />
    </div>
  );
}
