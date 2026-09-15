"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, X, Shield } from "lucide-react";
import { updateCustomerField, setCustomerDetails } from "@/Redux/Slices/bookingSlice";

export default function BookingDetailsDrawer({ isOpen, onClose, onPayNow }) {
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

  const validateField = (field, value) => {
    switch (field) {
      case "firstName":
      case "lastName":
        return Boolean(value && value.trim().length >= 2);
      case "mobile":
        return Boolean(value && /^\d{10}$/.test(String(value).replace(/\D/g, "")));
      case "email":
        return Boolean(value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
      case "city":
        return Boolean(value && value.trim().length >= 2);
      default:
        return true;
    }
  };

  const handleInputChange = (field, value) => {
    dispatch(updateCustomerField({ field, value }));
  };

  const isFormValid = () => {
    return (
      validateField("firstName", customerDetails?.firstName) &&
      validateField("lastName", customerDetails?.lastName) &&
      validateField("mobile", customerDetails?.mobile) &&
      validateField("email", customerDetails?.email) &&
      validateField("city", customerDetails?.city)
    );
  };

  const handlePayNow = () => {
    if (isFormValid()) {
      if (onClose) onClose();
      onPayNow(customerDetails);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose} shouldScaleBackground={false}>
      <DrawerContent className="max-h-[92vh] bg-white rounded-t-3xl border-t border-neutral-200">
        <DrawerHeader className="flex flex-row items-center justify-between px-5 py-3.5 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#ff6900]">
              <Shield className="w-3.5 h-3.5" />
              <span>Guest Details</span>
            </div>
            <DrawerTitle className="text-base font-bold text-neutral-900 text-left mt-0.5">
              Verify Contact Information
            </DrawerTitle>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Booking For */}
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 block">
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
                  id="mobile-myself"
                  className="border-2 border-[#ff6900] text-[#ff6900]"
                />
                <Label
                  htmlFor="mobile-myself"
                  className="text-sm font-semibold text-neutral-800 cursor-pointer"
                >
                  Myself
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="someone-else"
                  id="mobile-someone-else"
                  className="border-2 border-neutral-300 text-[#ff6900]"
                />
                <Label
                  htmlFor="mobile-someone-else"
                  className="text-sm font-semibold text-neutral-800 cursor-pointer"
                >
                  Someone else
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-neutral-700 block mb-1">
                First Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  value={customerDetails?.firstName || ""}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200/90 rounded-xl text-neutral-900 text-sm focus:bg-white focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900] pr-8"
                  placeholder="First name"
                />
                {validateField("firstName", customerDetails?.firstName) && (
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-neutral-700 block mb-1">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  value={customerDetails?.lastName || ""}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200/90 rounded-xl text-neutral-900 text-sm focus:bg-white focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900] pr-8"
                  placeholder="Last name"
                />
                {validateField("lastName", customerDetails?.lastName) && (
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div>
            <Label className="text-xs font-semibold text-neutral-700 block mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                value={customerDetails?.mobile ? `+91 ${customerDetails.mobile}` : ""}
                onChange={(e) => {
                  const val = e.target.value.replace("+91 ", "").replace(/\D/g, "");
                  if (val.length <= 10) handleInputChange("mobile", val);
                }}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200/90 rounded-xl text-neutral-900 text-sm focus:bg-white focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900] pr-8"
                placeholder="10-digit mobile number"
              />
              {validateField("mobile", customerDetails?.mobile) && (
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <Label className="text-xs font-semibold text-neutral-700 block mb-1">
              Email ID <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                value={customerDetails?.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200/90 rounded-xl text-neutral-900 text-sm focus:bg-white focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900] pr-8"
                placeholder="e.g. name@example.com"
                type="email"
              />
              {validateField("email", customerDetails?.email) && (
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* City */}
          <div>
            <Label className="text-xs font-semibold text-neutral-700 block mb-1">
              Residential City <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                value={customerDetails?.city || ""}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200/90 rounded-xl text-neutral-900 text-sm focus:bg-white focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900] pr-8"
                placeholder="e.g. Mumbai, Pune, Delhi"
              />
              {validateField("city", customerDetails?.city) && (
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pay Now Button */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200">
          <Button
            type="button"
            onClick={handlePayNow}
            disabled={!isFormValid()}
            className="w-full h-12 bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c84d00] text-white font-bold rounded-xl shadow-md shadow-orange-500/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Confirm & Proceed to Payment
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
