"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCustomerField, setCustomerDetails } from "@/Redux/Slices/bookingSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, Shield } from "lucide-react";

const VerifyDetailsDialog = ({ open, onOpenChange, onPayNow }) => {
  const dispatch = useDispatch();
  const customerDetails = useSelector((state) => state.booking.customerDetails);

  // Auto-populate from localStorage if available
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

  const handleInputChange = (field, value) => {
    dispatch(updateCustomerField({ field, value }));
  };

  const validateEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    if (!mobile) return false;
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
  };

  const validateName = (name) => {
    if (!name) return false;
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
  };

  const isFieldValid = (field) => {
    const value = customerDetails?.[field] || "";

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

  const isFormValid = () => {
    return (
      isFieldValid("firstName") &&
      isFieldValid("lastName") &&
      isFieldValid("mobile") &&
      isFieldValid("email") &&
      isFieldValid("city")
    );
  };

  const handlePayNow = () => {
    if (isFormValid()) {
      onPayNow();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] max-h-[92vh] p-0 flex flex-col bg-white rounded-3xl border border-neutral-200/80 shadow-2xl overflow-hidden">
        <DialogHeader className="p-5 pb-3 sm:p-6 sm:pb-3.5 border-b border-neutral-100 flex-shrink-0 text-left pr-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ff6900]">
            <Shield className="w-3.5 h-3.5" />
            <span>Secure Guest Verification</span>
          </div>
          <DialogTitle className="text-xl font-bold text-neutral-900 text-left pt-0.5">
            Guest & Contact Details
          </DialogTitle>
          <p className="text-xs text-neutral-500 text-left">
            Booking voucher and check-in access code will be sent to these details.
          </p>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-3.5 p-5 sm:p-6 pt-3.5">
            {/* Booking For */}
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block">
                I am booking for:
              </Label>
              <RadioGroup
                value={customerDetails?.bookingFor || "myself"}
                onValueChange={(val) => handleInputChange("bookingFor", val)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="myself"
                    id="myself"
                    className="border-2 border-[#ff6900] text-[#ff6900]"
                  />
                  <Label
                    htmlFor="myself"
                    className="text-xs sm:text-sm font-semibold text-neutral-800 cursor-pointer"
                  >
                    Myself
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="someone-else"
                    id="someone-else"
                    className="border-2 border-neutral-300 text-[#ff6900]"
                  />
                  <Label
                    htmlFor="someone-else"
                    className="text-xs sm:text-sm font-semibold text-neutral-800 cursor-pointer"
                  >
                    Someone else
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="firstName"
                  className="text-xs font-semibold text-neutral-700 block mb-1"
                >
                  First Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="firstName"
                    placeholder="e.g. John"
                    value={customerDetails?.firstName || ""}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200/80 rounded-xl text-neutral-900 font-medium focus:bg-white focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900] text-sm pr-9 transition-all"
                  />
                  {isFieldValid("firstName") && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label
                  htmlFor="lastName"
                  className="text-xs font-semibold text-neutral-700 block mb-1"
                >
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="lastName"
                    placeholder="e.g. Doe"
                    value={customerDetails?.lastName || ""}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200/80 rounded-xl text-neutral-900 font-medium focus:bg-white focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900] text-sm pr-9 transition-all"
                  />
                  {isFieldValid("lastName") && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="mobile"
                  className="text-xs font-semibold text-neutral-700 block mb-1"
                >
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="mobile"
                    placeholder="10-digit number"
                    value={customerDetails?.mobile ? `+91 ${customerDetails.mobile}` : ""}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace("+91 ", "")
                        .replace(/\D/g, "");
                      if (value.length <= 10) {
                        handleInputChange("mobile", value);
                      }
                    }}
                    maxLength={15}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200/80 rounded-xl text-neutral-900 font-medium focus:bg-white focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900] text-sm pr-9 transition-all"
                  />
                  {isFieldValid("mobile") && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold text-neutral-700 block mb-1"
                >
                  Email ID <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={customerDetails?.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200/80 rounded-xl text-neutral-900 font-medium focus:bg-white focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900] text-sm pr-9 transition-all"
                  />
                  {isFieldValid("email") && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* City & GST in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="city"
                  className="text-xs font-semibold text-neutral-700 block mb-1"
                >
                  Residential City <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="city"
                    placeholder="e.g. Mumbai, Pune"
                    value={customerDetails?.city || ""}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200/80 rounded-xl text-neutral-900 font-medium focus:bg-white focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900] text-sm pr-9 transition-all"
                  />
                  {isFieldValid("city") && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label
                  htmlFor="gstNumber"
                  className="text-xs font-semibold text-neutral-600 block mb-1"
                >
                  GST Details (Optional)
                </Label>
                <Input
                  id="gstNumber"
                  placeholder="e.g. 27AABCU9603R1ZM"
                  value={customerDetails?.gstNumber || ""}
                  onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200/80 rounded-xl text-neutral-800 placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900] text-xs transition-all"
                />
              </div>
            </div>

            {/* Pay Now Button */}
            <Button
              type="button"
              className="w-full bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c84d00] text-white font-bold py-3 rounded-xl text-sm shadow-md shadow-orange-500/20 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              disabled={!isFormValid()}
              onClick={handlePayNow}
            >
              Confirm & Proceed to Pay
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyDetailsDialog;
