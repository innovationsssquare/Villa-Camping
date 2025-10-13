"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@heroui/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FaCheck, FaTimes } from "react-icons/fa";
import { updateCustomerField } from "@/Redux/Slices/bookingSlice";

export default function BookingDetailsDrawer({ isOpen, onClose, onPayNow }) {
  const dispatch = useDispatch();
  const customerDetails = useSelector((state) => state.booking.customerDetails);

  const [validationStatus, setValidationStatus] = useState({
    firstName: false,
    lastName: false,
    mobile: false,
    email: false,
  });

  const validateField = (field, value) => {
    let isValid = false;

    switch (field) {
      case "firstName":
      case "lastName":
        isValid = value.trim().length >= 2;
        break;
      case "mobile":
        isValid = /^(\+91\s?)?[6-9]\d{9}$/.test(value.replace(/\s/g, ""));
        break;
      case "email":
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
    }

    setValidationStatus((prev) => ({ ...prev, [field]: isValid }));
    return isValid;
  };

  const handleInputChange = (field, value) => {
    dispatch(updateCustomerField({ field, value }));

    if (["firstName", "lastName", "mobile", "email"].includes(field)) {
      validateField(field, value);
    }
  };

  const isFormValid = () => {
    return (
      validationStatus.firstName &&
      validationStatus.lastName &&
      validationStatus.mobile &&
      validationStatus.email
    );
  };

  const handlePayNow = () => {
    if (isFormValid()) {
      onPayNow(customerDetails);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose} shouldScaleBackground={false}>
      <DrawerContent className="h-[90vh] bg-white border-none">
        <DrawerHeader className="flex flex-row items-center justify-between px-3 ">
          <DrawerTitle className="text-lg font-semibold text-black">
            Verify your details
          </DrawerTitle>
          <Button
            variant="light"
            size="sm"
            isIconOnly
            onPress={onClose}
            className="h-8 w-8 p-0 border rounded-full bg-white hover:bg-gray-100"
          >
            <FaTimes className="h-4 w-4 text-gray-600" />
          </Button>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Booking For */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-black">
              {`I'm booking for :`}
            </Label>
            <RadioGroup
              value={customerDetails.bookingFor}
              onValueChange={(value) => handleInputChange("bookingFor", value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="myself"
                  id="myself"
                  className="border-2 border-orange-300 text-orange-500"
                />
                <Label
                  htmlFor="myself"
                  className="text-base text-black cursor-pointer"
                >
                  Myself
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="someone-else"
                  id="someone-else"
                  className="border-2 border-orange-300 text-orange-500"
                />
                <Label
                  htmlFor="someone-else"
                  className="text-base text-black cursor-pointer"
                >
                  Someone else
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* First Name */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-600">
              First Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                value={customerDetails.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="border-gray-200 bg-white border text-black pr-10 h-12"
                placeholder="Enter first name"
              />
              {customerDetails.firstName && (
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
                value={customerDetails.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="border-gray-200 bg-white border text-black pr-10 h-12"
                placeholder="Enter last name"
              />
              {customerDetails.lastName && (
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

          {/* Mobile */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-600">
              Mobile Number <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                value={customerDetails.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                className="border-gray-200 bg-white border text-black pr-10 h-12"
                placeholder="+91 Enter mobile number"
              />
              {customerDetails.mobile && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {validationStatus.mobile ? (
                    <FaCheck className="h-4 w-4 text-green-500" />
                  ) : (
                    <FaTimes className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-600">
              Email ID <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                value={customerDetails.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="border-gray-200 bg-white border text-black pr-10 h-12"
                placeholder="Enter email address"
                type="email"
              />
              {customerDetails.email && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {validationStatus.email ? (
                    <FaCheck className="h-4 w-4 text-green-500" />
                  ) : (
                    <FaTimes className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-600">Residential City</Label>
            <Input
              value={customerDetails.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="border-gray-200 bg-white border text-black pr-10 h-12"
              placeholder="Enter city"
            />
          </div>
        </div>

        {/* Pay Now */}
        <div className="p-3 bg-gray-50">
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
  );
}
