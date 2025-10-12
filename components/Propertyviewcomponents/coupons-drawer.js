"use client";

import React from "react";
import { useState } from "react";
import { FaTimes, FaTicketAlt } from "react-icons/fa";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@heroui/react";
import { X } from "lucide-react";

const CouponsDrawer = ({ isOpen, onClose, onApplyCoupon, appliedCoupon }) => {
  const [couponCode, setCouponCode] = useState("");

  const availableCoupons = [
    {
      code: "THEVILLA",
      title: "Book your dreamy getaway",
      description:
        "Book your dreamy getaway for a minimum of 2 nights and get 10% off upto 3000 Rs. Use the code STAYVISTA at check-out.",
      discount: 10,
      maxDiscount: 3000,
      validTill: "31 December 2025",
    },
    {
      code: "VILACAMP2025",
      title: "Get an instant 10% off",
      description:
        "Get an instant 10% off, up to Rs. 4,000. This offer is applicable on bookings of 3 or more nights only.",
      discount: 10,
      maxDiscount: 4000,
      validTill: "31 December 2025",
      minNights: 3,
    },
    {
      code: "ESCAPE5",
      title: "Get 5% off your next getaway",
      description: "Get 5% upto 1500 off on your next getaway!",
      discount: 5,
      maxDiscount: 1500,
      validTill: "31 December 2025",
    },
  ];

  const handleManualApply = () => {
    const foundCoupon = availableCoupons.find(
      (coupon) => coupon.code.toLowerCase() === couponCode.toLowerCase()
    );
    if (foundCoupon) {
      onApplyCoupon(foundCoupon);
      setCouponCode("");
    }
  };

  const handleCouponApply = (coupon) => {
    onApplyCoupon(coupon);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[80vh] border-none">
        <DrawerHeader className="flex flex-row items-center justify-between p-2 border-b border-gray-100">
          <DrawerTitle className="text-lg font-semibold text-black">
            Coupons and Offers
          </DrawerTitle>
          <DrawerClose asChild>
            <Button
              variant="light"
              size="icon"
              onPress={onClose}
              className="rounded-full p-1 border-gray-300 border "
            >
              <X className="h-5 w-5 text-black" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Manual Coupon Entry */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <Button
              onPress={handleManualApply}
              disabled={!couponCode.trim()}
              className="w-full bg-black text-white py-3 rounded-lg font-medium disabled:bg-black disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
            >
              APPLY
            </Button>
          </div>

          {/* Available Offers */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-gray-600">
                Offers Available
              </h3>
              <span className="text-xs text-gray-400">T&C</span>
            </div>

            {/* Coupon Cards */}
            {availableCoupons.map((coupon) => (
              <div
                key={coupon.code}
                className="border border-white bg-gray-200 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">
                      valid till: {coupon.validTill}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      {coupon.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <FaTicketAlt className="w-4 h-4 text-gray-600" />
                      <span className="font-bold text-black text-lg">
                        {coupon.code}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCouponApply(coupon)}
                    disabled={appliedCoupon?.code === coupon.code}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                  >
                    {appliedCoupon?.code === coupon.code ? "APPLIED" : "APPLY"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CouponsDrawer;
