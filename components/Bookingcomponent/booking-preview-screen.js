"use client"

import { useState } from "react"
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
} from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import CouponsDrawer from "@/components/Propertyviewcomponents/coupons-drawer"




export default function BookingPreviewScreen({onClose} ) {
  const [currentStep, setCurrentStep] = useState("overview")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [specialRequests, setSpecialRequests] = useState("")

  const [isCouponsDrawerOpen, setIsCouponsDrawerOpen] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState({
    code: "STAYVISTA",
    title: "Book your dreamy getaway",
    description: "Book your dreamy getaway for a minimum of 2 nights and get 10% off upto 3000 Rs.",
    discount: 10,
    maxDiscount: 3000,
    validTill: "31 December 2025",
  })


  const handleNext = () => {
    if (currentStep === "overview") {
      setCurrentStep("policy")
    } else if (currentStep === "policy") {
      setCurrentStep("price")
    }
  }

  const handleBack = () => {
    if (currentStep === "policy") {
      setCurrentStep("overview")
    } else if (currentStep === "price") {
      setCurrentStep("policy")
    }
  }

  const handleApplyCoupon = (coupon) => {
    setAppliedCoupon(coupon)
    setIsCouponsDrawerOpen(false)
    // Trigger confetti animation here if needed
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
  }

  const getStepNumber = () => {
    switch (currentStep) {
      case "overview":
        return 1
      case "policy":
        return 2
      case "price":
        return 3
      default:
        return 1
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Property Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-black mb-1">Sol & Sands</h2>
            <p className="text-gray-600 mb-2">Alibaug, Maharashtra</p>
            <div className="flex items-center gap-2">
              <FaStar className="text-orange-500 w-4 h-4" />
              <span className="font-medium text-black">5</span>
              <span className="text-sm text-gray-600">Guest Favourite!</span>
            </div>
          </div>
          <div className="relative">
            <img
              src="/luxury-resort-sunset-pool.png"
              alt="Sol & Sands"
              className="w-[120px] h-[80px] rounded-lg object-cover"
            />
            <Button size="sm" variant="ghost" className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black/70">
              <FaArrowRight className="w-3 h-3 text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-black">Trip Details</h3>
          <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">For 2 nights</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600 text-sm mb-1">Check-In</p>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-500 w-4 h-4" />
              <div>
                <p className="font-medium text-black">24 Aug</p>
                <p className="font-medium text-black">2025</p>
                <p className="text-xs text-gray-500">(From 02:00 PM)</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Check-Out</p>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-500 w-4 h-4" />
              <div>
                <p className="font-medium text-black">26 Aug</p>
                <p className="font-medium text-black">2025</p>
                <p className="text-xs text-gray-500">(Until 11:00 AM)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-gray-600 text-sm mb-1">Guests</p>
            <div className="flex items-center gap-2">
              <FaUsers className="text-gray-500 w-4 h-4" />
              <div>
                <p className="font-medium text-black">2 Guests</p>
                <p className="text-xs text-gray-500">(2 Adults )</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">No. of Rooms</p>
            <div className="flex items-center gap-2">
              <FaBed className="text-gray-500 w-4 h-4" />
              <p className="font-medium text-black">1 Room</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPriceDetails = () => (
    <div className="space-y-6">
      {/* Price Details Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-black mb-4">Price details</h3>

        {/* Zero Convenience Fee */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center justify-between">
          <p className="text-green-700 text-sm">You pay zero convenience fees on your booking!</p>
          <div className="bg-green-500 rounded-full p-1">
            <FaInfoCircle className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-black">Rental Charges</span>
              <FaInfoCircle className="w-4 h-4 text-gray-400" />
            </div>
            <span className="font-medium text-black">₹1,11,725</span>
          </div>

          {appliedCoupon && (
            <div className="flex justify-between items-center">
              <span className="text-green-600">Discount ({appliedCoupon.code})</span>
              <span className="text-green-600">(-) ₹{appliedCoupon.maxDiscount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              <span className="text-black">GST</span>
              <span className="text-xs text-gray-500 ml-1">(As per government guidelines)</span>
            </div>
            <span className="font-medium text-black">₹19,571</span>
          </div>
        </div>

        {appliedCoupon && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 rounded-full p-2">
                <FaPercent className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="font-medium text-black">{appliedCoupon.code}</p>
                <p className="text-sm text-green-600">Congrats you applied the offer</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleRemoveCoupon}
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
          <span className="text-sm">View more coupons/ Apply Future Stay Voucher</span>
          <FaArrowRight className="w-3 h-3" />
        </button>

        <hr className="my-4" />

        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-black">Total Payable</span>
          <span className="text-lg font-semibold text-black">
            ₹{(111725 + 19571 - (appliedCoupon?.maxDiscount || 0)).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Meals Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-black mb-3">Meals</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Indulge in an all-day meal package of freshly prepared North Indian vegetarian and non-vegetarian local
          specialities. The package comprises lunch (the first meal after check-in), evening snacks, and dinner,
          followed by breakfast
        </p>
      </div>
    </div>
  )

  const renderCancellationPolicy = () => (
    <div className="space-y-6">
      {/* Cancellation Policy Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-black mb-4">Booking & Cancellation policy</h3>

        {/* No Refund */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 rounded-full p-2">
            <FaTimes className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <p className="font-medium text-black">No Refund</p>
            <p className="text-sm text-gray-600">On your selected dates</p>
          </div>
        </div>

        {/* Policy Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            Refund Policy
          </Button>
          <Button variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            Home Rules and Policy
          </Button>
        </div>

        {/* Check-in/out Times */}
        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            <span className="font-medium">Check-in time: 2:00 PM</span>,{" "}
            <span className="font-medium">Check-out time: 11:00 AM</span>
          </p>
          <div className="flex items-start gap-2">
            <FaInfoCircle className="w-4 h-4 text-gray-400 mt-0.5" />
            <p className="text-sm text-gray-600">
              Early check-in and late check-out is subject to availability (at an additional fee)
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
          <div className="text-sm">
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
            <span className="text-gray-700"> and </span>
            <a href="#" className="text-blue-600 underline">
              Indemnity Form
            </a>
          </div>
        </div>
      </div>

      {/* Special Requests */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <FaGift className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-black">Any special requests?</h3>
        </div>

        <Textarea
          placeholder="(Birthday, Anniversary, Family getaway etc.)"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          className="mb-3 min-h-[120px] resize-none"
        />

        <p className="text-sm text-gray-600">
          Share your special requests with us and we'll do our best to accommodate them!
        </p>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={currentStep === "overview" ? onClose : handleBack}
                className="p-2"
              >
                <FaArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-black">Review Booking</h1>
                <p className="text-xs text-gray-500">Step {getStepNumber()} of 3</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="p-2">
                <FaPhone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 relative">
                <FaBell className="w-4 h-4" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </Button>
              <Button variant="ghost" size="sm" className="p-2 bg-black text-white rounded-full">
                <FaUser className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {currentStep === "overview" && renderOverview()}
          {currentStep === "price" && renderPriceDetails()}
          {currentStep === "policy" && renderCancellationPolicy()}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200">
          {/* Security Badge */}
          <div className="bg-green-500 text-white px-4 py-2 flex items-center justify-center gap-2">
            <FaShieldAlt className="w-4 h-4" />
            <span className="text-sm font-medium">100% Secure payment</span>
            <span className="text-sm">Trusted by 5Lakh+ guests</span>
          </div>

          <div className="px-4 py-4 flex items-center justify-between">
            {currentStep === "price" ? (
              <>
                <div>
                  <p className="text-xl font-bold text-black">
                    ₹{(111725 + 19571 - (appliedCoupon?.maxDiscount || 0)).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">( For 2 nights,2 guests )</p>
                </div>
                <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-full">Continue</Button>
              </>
            ) : (
              <>
                <div>
                  <p className="text-xl font-bold text-black">₹1,28,296</p>
                  <p className="text-sm text-gray-600">( For 2 nights,2 guests )</p>
                </div>
                <Button onClick={handleNext} className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-full">
                  Next
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <CouponsDrawer
        isOpen={isCouponsDrawerOpen}
        onClose={() => setIsCouponsDrawerOpen(false)}
        onApplyCoupon={handleApplyCoupon}
        appliedCoupon={appliedCoupon}
      />
    </div>
  )
}
