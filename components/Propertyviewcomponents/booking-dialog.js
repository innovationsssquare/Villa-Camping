"use client"

import { useState } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import {
  FaTimes,
  FaInfoCircle,
  FaChevronDown,
  FaPercent,
  FaTicketAlt,
  FaArrowRight,
  FaUndo,
  FaArrowLeft,
} from "react-icons/fa"
import CouponsDrawer from "./coupons-drawer"
import GuestSelectionDrawer from "./guest-selection-drawer"
import confetti from "canvas-confetti"





export default function BookingDialog({ isOpen, onClose, propertyName, price, originalPrice }) {
  const [isLoading, setIsLoading] = useState(false)
  const [preBookMeals, setPreBookMeals] = useState(false)
  const [guestCounts, setGuestCounts] = useState({
    adults: 2,
    children: 0,
    infants: 0,
  })
  const [isCouponsDrawerOpen, setIsCouponsDrawerOpen] = useState(false)
  const [isGuestDrawerOpen, setIsGuestDrawerOpen] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState({
    code: "ESCAPE5",
    title: "Get 5% off your next getaway",
    description: "Get 5% upto 1500 off on your next getaway!",
    discount: 5,
    maxDiscount: 1500,
    validTill: "31 December 2025",
  })

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [datePickerType, setDatePickerType] = useState("checkin")
  const [checkInDate, setCheckInDate] = useState(new Date(2024, 7, 24)) // Aug 24, 2024
  const [checkOutDate, setCheckOutDate] = useState(new Date(2024, 7, 26)) // Aug 26, 2024

  const totalGuests = guestCounts.adults + guestCounts.children + guestCounts.infants

  const basePrice = price
  const discountAmount = appliedCoupon
    ? Math.min((basePrice * appliedCoupon.discount) / 100, appliedCoupon.maxDiscount)
    : 0
  const totalPrice = basePrice - discountAmount
  const taxAmount = Math.round(totalPrice * 0.18) // 18% tax
  const finalTotal = totalPrice + taxAmount

  const handleBooking = () => {
    setIsLoading(true)
    // Simulate booking process
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  const handleApplyCoupon = (coupon) => {
    setAppliedCoupon(coupon)
    setIsCouponsDrawerOpen(false)
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10B981", "#059669", "#047857"],
    })
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
  }

  const handleGuestCountsChange = (newCounts) => {
    setGuestCounts(newCounts)
  }

  const handleDateSelect = (date) => {
    if (!date) return

    if (datePickerType === "checkin") {
      setCheckInDate(date)
      // If check-in is after check-out, update check-out to next day
      if (date >= checkOutDate) {
        const nextDay = new Date(date)
        nextDay.setDate(nextDay.getDate() + 1)
        setCheckOutDate(nextDay)
      }
    } else {
      setCheckOutDate(date)
    }
    setShowDatePicker(false)
  }

  const openDatePicker = (type) => {
    setDatePickerType(type)
    setShowDatePicker(true)
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  return (
    <>
      <Drawer
        open={isOpen}
        onOpenChange={() => {}} // Non-dismissible
        shouldScaleBackground={false}
      >
        <DrawerContent className="max-h-[95vh] bg-white">
          <DrawerHeader className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b w-full">
              {showDatePicker ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDatePicker(false)}
                    className="rounded-full hover:bg-gray-100"
                  >
                    <FaArrowLeft className="h-5 w-5 text-black" />
                  </Button>
                  <DrawerTitle className="text-xl font-bold text-black">
                    Select {datePickerType === "checkin" ? "Check-in" : "Check-out"} Date
                  </DrawerTitle>
                  <div className="w-10" /> {/* Spacer */}
                </>
              ) : (
                <>
                  <DrawerTitle className="text-xl font-bold text-black">{propertyName}</DrawerTitle>
                  <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-100">
                    <FaTimes className="h-5 w-5 text-black" />
                  </Button>
                </>
              )}
            </div>
          </DrawerHeader>

          <div className="p-4 space-y-6 overflow-y-auto flex-1">
            {showDatePicker ? (
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={datePickerType === "checkin" ? checkInDate : checkOutDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    if (datePickerType === "checkout") {
                      return date < checkInDate
                    }
                    return date < today
                  }}
                  className="rounded-md border"
                />
              </div>
            ) : (
              <>
                {/* Price */}
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-black">₹{price.toLocaleString()}</span>
                    {originalPrice && (
                      <span className="text-gray-500 line-through">₹{originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">(For 1 room) Per night + taxes</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Check-in</label>
                    <button
                      onClick={() => openDatePicker("checkin")}
                      className="w-full border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-black">{formatDate(checkInDate)}</p>
                          <p className="text-sm text-gray-600">2:00pm</p>
                        </div>
                        <FaChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </button>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Check-out</label>
                    <button
                      onClick={() => openDatePicker("checkout")}
                      className="w-full border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-black">{formatDate(checkOutDate)}</p>
                          <p className="text-sm text-gray-600">11:00am</p>
                        </div>
                        <FaChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Guests</label>
                  <button
                    onClick={() => setIsGuestDrawerOpen(true)}
                    className="w-full border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-black">
                        {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
                      </span>
                      <FaChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                </div>

                {/* Pre-book meals */}
                <Card className="p-4 bg-orange-50 border-orange-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-black font-medium">Pre-book your meals</span>
                      <FaInfoCircle className="h-4 w-4 text-gray-400" />
                    </div>
                    <Checkbox checked={preBookMeals} onCheckedChange={setPreBookMeals} className="border-gray-400" />
                  </div>
                </Card>

                {appliedCoupon && (
                  <Card className="p-4 border-green-200 bg-green-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <FaPercent className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-black">{appliedCoupon.code}</p>
                          <p className="text-sm text-green-600">₹{discountAmount.toLocaleString()} Discount applied!</p>
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
                  </Card>
                )}

                <div className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                    onClick={() => setIsCouponsDrawerOpen(true)}
                  >
                    <FaTicketAlt className="h-4 w-4 mr-2" />
                    View more coupons
                    <FaArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xl font-bold text-black">Total</span>
                      <Button variant="link" className="p-0 ml-2 text-blue-500 underline text-sm">
                        See details
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-black">₹{finalTotal.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">(Incl. taxes)</p>
                    </div>
                  </div>
                </div>

                {/* Cancellation Policy */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaUndo className="h-4 w-4" />
                  <span>For Cancellation and Refund Policy, </span>
                  <Button variant="link" className="p-0 h-auto text-blue-500 underline text-sm">
                    click here
                  </Button>
                </div>

                {/* Book Button */}
                <Button
                  className="w-full h-12 text-lg font-semibold bg-black hover:bg-gray-800 text-white rounded-lg"
                  onClick={handleBooking}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Book Now"}
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
  )
}
