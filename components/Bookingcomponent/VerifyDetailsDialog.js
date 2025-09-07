import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, X } from "lucide-react";

const VerifyDetailsDialog = ({ open, onOpenChange }) => {
  const [bookingFor, setBookingFor] = useState("myself");
  const [formData, setFormData] = useState({
    firstName: "Bdbd",
    lastName: "Bxbdnbd",
    mobile: "8669186483",
    email: "Bxbdb@gmaul.com",
    city: "Yes",
    gstNumber: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
  };

  const validateName = (name) => {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
  };

  const isFieldValid = (field) => {
    const value = formData[field];

    switch (field) {
      case "email":
        return validateEmail(value);
      case "mobile":
        return validateMobile(value);
      case "firstName":
      case "lastName":
        return validateName(value);
      case "city":
        return value.trim().length >= 2;
      default:
        return value.length > 0;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] max-h-[90vh] overflow-y-auto p-8 bg-white rounded-lg">
        <DialogHeader className="relative">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
          <DialogTitle className="text-xl font-semibold text-gray-900 text-left">
            Verify your details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Booking For */}
          <div>
            <Label className="text-sm font-medium text-gray-900 mb-4 block">
              I'm booking for :
            </Label>
            <RadioGroup
              value={bookingFor}
              onValueChange={setBookingFor}
              className="flex gap-8"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="myself"
                  id="myself"
                  className="border-2 border-blue-500 text-blue-500"
                />
                <Label
                  htmlFor="myself"
                  className="text-sm font-medium text-gray-900"
                >
                  Myself
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="someone-else"
                  id="someone-else"
                  className="border-2"
                />
                <Label
                  htmlFor="someone-else"
                  className="text-sm font-medium text-gray-900"
                >
                  Someone else
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="firstName"
                className="text-sm font-medium text-gray-700 block mb-2"
              >
                First Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 pr-10"
                />
                {isFieldValid("firstName") && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label
                htmlFor="lastName"
                className="text-sm font-medium text-gray-700 block mb-2"
              >
                Last Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 pr-10"
                />
                {isFieldValid("lastName") && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="mobile"
                className="text-sm font-medium text-gray-700 block mb-2"
              >
                Mobile Number <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="mobile"
                  value={`+91  ${formData.mobile}`}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace("+91  ", "")
                      .replace(/\D/g, "");
                    if (value.length <= 10) {
                      handleInputChange("mobile", value);
                    }
                  }}
                  maxLength={15}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 pr-10"
                />
                {isFieldValid("mobile") && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 block mb-2"
              >
                Email ID <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 pr-10"
                />
                {isFieldValid("email") && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* City */}
          <div>
            <Label
              htmlFor="city"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              Residential City
            </Label>
            <div className="relative">
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 pr-10"
              />
              {isFieldValid("city") && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* GST Details */}
          <div>
            <Label className="text-sm font-medium text-gray-900 mb-2 block">
              Enter GST details (optional)
            </Label>
            <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
              For GST invoice, please enter and verify your GST no. below
              <span className="text-base">👇</span>
            </p>
            <Input
              placeholder="GST Number"
              value={formData.gstNumber}
              onChange={(e) => handleInputChange("gstNumber", e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-500 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Pay Now Button */}
          <Button
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-4 rounded-lg text-base mt-8"
            onClick={() => {
              // Handle payment logic here
              console.log("Processing payment...");
            }}
          >
            Pay Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyDetailsDialog;
