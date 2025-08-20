"use client"

import { useState } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FaCheck, FaTimes } from "react-icons/fa"

export default function BookingDetailsDrawer({ isOpen, onClose, onPayNow }) {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    bookingFor: "myself",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    emailId: "",
    residentialCity: "",
    gstDetails: "",
  })

  const [validationStatus, setValidationStatus] = useState({
    firstName: false,
    lastName: false,
    mobileNumber: false,
    emailId: false,
  })

  const validateField = (field, value) => {
    let isValid = false

    switch (field) {
      case "firstName":
      case "lastName":
        isValid = value.trim().length >= 2
        break
      case "mobileNumber":
        isValid = /^(\+91\s?)?[6-9]\d{9}$/.test(value.replace(/\s/g, ""))
        break
      case "emailId":
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        break
    }

    setValidationStatus((prev) => ({ ...prev, [field]: isValid }))
    return isValid
  }

  const handleInputChange = (field, value) => {
    setBookingDetails((prev) => ({ ...prev, [field]: value }))

    if (field !== "residentialCity" && field !== "gstDetails" && field !== "bookingFor") {
      validateField(field, value)
    }
  }

  const isFormValid = () => {
    return (
      validationStatus.firstName &&
      validationStatus.lastName &&
      validationStatus.mobileNumber &&
      validationStatus.emailId
    )
  }

  const handlePayNow = () => {
    if (isFormValid()) {
      onPayNow(bookingDetails)
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={() => {}} shouldScaleBackground={false}>
      <DrawerContent className="h-[90vh] bg-white">
        <DrawerHeader className="flex items-center justify-between p-4 border-b">
          <DrawerTitle className="text-lg font-semibold text-black">Verify your details</DrawerTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-gray-100">
            <FaTimes className="h-4 w-4 text-gray-600" />
          </Button>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Booking For Section */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-black">I'm booking for :</Label>
            <RadioGroup
              value={bookingDetails.bookingFor}
              onValueChange={(value) => handleInputChange("bookingFor", value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="myself" id="myself" className="border-2 border-blue-500 text-blue-500" />
                <Label htmlFor="myself" className="text-base text-black cursor-pointer">
                  Myself
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="someone-else" id="someone-else" className="border-2 border-gray-300" />
                <Label htmlFor="someone-else" className="text-base text-black cursor-pointer">
                  Someone else
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">
                First Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  value={bookingDetails.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="bg-gray-100 border-0 text-black pr-10 h-12"
                  placeholder="Enter first name"
                />
                {bookingDetails.firstName && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {validationStatus.firstName ? (
                      <FaCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <FaTimes className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  value={bookingDetails.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="bg-gray-100 border-0 text-black pr-10 h-12"
                  placeholder="Enter last name"
                />
                {bookingDetails.lastName && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {validationStatus.lastName ? (
                      <FaCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <FaTimes className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">
                Mobile Number <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  value={bookingDetails.mobileNumber}
                  onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                  className="bg-gray-100 border-0 text-black pr-10 h-12"
                  placeholder="+91 Enter mobile number"
                />
                {bookingDetails.mobileNumber && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {validationStatus.mobileNumber ? (
                      <FaCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <FaTimes className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Email ID */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">
                Email ID <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  value={bookingDetails.emailId}
                  onChange={(e) => handleInputChange("emailId", e.target.value)}
                  className="bg-gray-100 border-0 text-black pr-10 h-12"
                  placeholder="Enter email address"
                  type="email"
                />
                {bookingDetails.emailId && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {validationStatus.emailId ? (
                      <FaCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <FaTimes className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Residential City */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Residential City</Label>
              <Input
                value={bookingDetails.residentialCity}
                onChange={(e) => handleInputChange("residentialCity", e.target.value)}
                className="bg-gray-100 border-0 text-black h-12"
                placeholder="Enter city"
              />
            </div>
          </div>

          {/* GST Details */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-black">Enter GST details (optional)</Label>
            <Input
              value={bookingDetails.gstDetails}
              onChange={(e) => handleInputChange("gstDetails", e.target.value)}
              className="bg-gray-100 border-0 text-black h-12"
              placeholder="Enter GST number"
            />
          </div>
        </div>

        {/* Pay Now Button */}
        <div className="p-4 border-t bg-white">
          <Button
            onClick={handlePayNow}
            disabled={!isFormValid()}
            className="w-full h-12 bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 text-base font-medium"
          >
            Pay Now
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
