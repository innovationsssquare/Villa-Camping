// components/CouponsDrawer.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FaTicketAlt } from "react-icons/fa";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button, addToast } from "@heroui/react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCouponsByProperty,
  applyCoupon,
  clearApplyState,
} from "@/Redux/Slices/couponsSlice";
import { getDeviceId } from "@/lib/deviceId";
import ButtonLoader from "../Loadercomponents/button-loader";

const CouponsDrawer = ({
  isOpen,
  onClose,
  onApplyCoupon,
  appliedCoupon,
  propertyId,
  propertyType,
  subtotal = 0,
  checkIn = null,
  checkOut = null,
  nights = null,
}) => {
  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState("");
  // NEW: separate loading states
  const [isApplyingManual, setIsApplyingManual] = useState(false);
  const [applyingCode, setApplyingCode] = useState(null); // string => coupon code being applied from cards
  const [currentDeviceId, setCurrentDeviceId] = useState(null);
  const isSubtotalInvalid =
    !Number.isFinite(Number(subtotal)) || Number(subtotal) <= 0;

  useEffect(() => {
    getDeviceId().then((id) => {
      if (id) setCurrentDeviceId(id);
    });
  }, []);

  // redux slice state
  const {
    list = [],
    fetchStatus = "idle",
    fetchError = null,
    applyStatus = "idle",
    applyError = null,
  } = useSelector((s) => s.coupons ?? {});

  useEffect(() => {
    if (isOpen && propertyId) {
      dispatch(fetchCouponsByProperty(propertyId));
    }
    if (!isOpen) {
      setCouponCode("");
      dispatch(clearApplyState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, propertyId]);

  const getUserId = () => {
    try {
      if (typeof window === "undefined") return null;
      return localStorage.getItem("thevilla_user_id");
    } catch {
      return null;
    }
  };

  const parseValidTill = (validTill) => {
    if (!validTill) return null;
    if (typeof validTill === "string") return new Date(validTill);
    if (validTill?.$date) return new Date(validTill.$date);
    if (validTill?.$numberLong) return new Date(Number(validTill.$numberLong));
    return new Date(validTill);
  };

  const formatDateReadable = (d) => {
    try {
      if (!d) return "—";
      const dt = parseValidTill(d);
      if (!dt || Number.isNaN(dt.getTime())) return "—";
      return dt.toLocaleDateString();
    } catch {
      return "—";
    }
  };

  const normalizeCouponForUI = (c) => {
    return {
      ...c,
      code: (c.code || "").toUpperCase(),
      description: c.description || c.title || "",
      validTillReadable: formatDateReadable(c.validTill),
      minNights: c.minNights ?? c.minNights ?? null,
      discountAmount:
        (c.discount && (c.discount.amount ?? 0)) ||
        c.discountAmount ||
        c.amount ||
        0,
      discountType:
        (c.discount && c.discount.type) || c.discountType || "percentage",
      maxDiscount: c.maxDiscount ?? c.maxDiscountAmount ?? 0,
      isUsedOnThisDevice: Boolean(
        currentDeviceId &&
        Array.isArray(c.devicesUsed) &&
        c.devicesUsed.includes(currentDeviceId)
      ),
    };
  };

  const couponsToRender = useMemo(() => {
    return (list || []).map((c) => normalizeCouponForUI(c));
  }, [list, currentDeviceId]);

  const normalizeApplyResponse = (apiResponse) => {
    const payload = apiResponse?.data ?? apiResponse ?? {};
    const backendCoupon = payload?.coupon ?? payload;
    const discountAmount =
      payload?.discountAmount ?? payload?.discountValue ?? 0;

    return {
      applied: true,
      code: backendCoupon?.code ?? "",
      couponId: backendCoupon?._id ?? backendCoupon?.couponId ?? null,
      discountType:
        (backendCoupon?.discount && backendCoupon.discount.type) ||
        "percentage",
      discountValue:
        (backendCoupon?.discount && backendCoupon.discount.amount) ||
        backendCoupon?.discountValue ||
        0,
      discountAmount: Number(discountAmount),
      maxDiscount:
        backendCoupon?.maxDiscount ??
        backendCoupon?.maxDiscountAmount ??
        backendCoupon?.maxDiscountValue ??
        0,
      appliedAt: new Date().toISOString(),
      couponType: backendCoupon?.type ?? "coupon",
      title: backendCoupon?.title ?? backendCoupon?.name ?? "",
    };
  };

  // CORE: apply via thunk, but use separate loading flags depending on source
  const callApply = async ({ code, source = "card" }) => {
    // source: "manual" | "card"
    try {
      if (source === "manual") setIsApplyingManual(true);
      else setApplyingCode(code);

      const deviceId = await getDeviceId();
      const userId = getUserId();

      // Guard: Pre-check if coupon is already used on this device
      const targetCoupon = (list || []).find(
        (c) => c.code?.toUpperCase() === code.trim().toUpperCase()
      );
      if (
        targetCoupon &&
        deviceId &&
        Array.isArray(targetCoupon.devicesUsed) &&
        targetCoupon.devicesUsed.includes(deviceId)
      ) {
        addToast?.({
          title: "Coupon Already Used",
          description: "This coupon has already been used on this device.",
          color: "danger",
        });
        if (source === "manual") setIsApplyingManual(false);
        else setApplyingCode(null);
        return;
      }

      const payload = {
        couponCode: code,
        orderValue: subtotal ?? 0,
        userId,
        deviceId,
        propertyType,
        propertyId,
        checkIn,
        checkOut,
      };

      const res = await dispatch(applyCoupon(payload)).unwrap();

      const normalized = normalizeApplyResponse(res);

      if (typeof onApplyCoupon === "function") {
        onApplyCoupon(normalized);
      }

      addToast?.({
        title: "Coupon applied",
        description: `${normalized.code} applied successfully`,
        color: "success",
      });

      onClose();
      return normalized;
    } catch (err) {
      const msg = err?.message || applyError || "Failed to apply coupon";
      addToast?.({
        title: "Apply failed",
        description: msg,
        color: "danger",
      });
      console.error("apply coupon error:", err);
      throw err;
    } finally {
      if (source === "manual") setIsApplyingManual(false);
      else setApplyingCode(null);
    }
  };

  // Manual apply: uses its own loading state
  const handleManualApply = async () => {
    if (isSubtotalInvalid) {
      addToast?.({
        title: "Cannot apply coupon",
        description: "Please select dates / tents to calculate total first.",
        color: "danger",
      });
      return;
    }

    const code = couponCode?.trim();
    if (!code) return;
    const found = (couponsToRender || []).find(
      (c) => (c.code || "").toUpperCase() === code.toUpperCase()
    );
    if (found) {
      if (
        found.minNights &&
        nights != null &&
        nights < Number(found.minNights)
      ) {
        addToast?.({
          title: "Minimum nights required",
          description: `This coupon requires at least ${found.minNights} nights.`,
          color: "danger",
        });
        return;
      }
    }
    try {
      await callApply({ code: code.toUpperCase(), source: "manual" });
      setCouponCode("");
    } catch {
      // error handled inside callApply
    }
  };

  // Card apply: sets applyingCode to that coupon code
  const handleCouponApply = async (coupon) => {
    if (isSubtotalInvalid) {
      addToast?.({
        title: "Cannot apply coupon",
        description: "Please select dates / tents to calculate total first.",
        color: "danger",
      });
      return;
    }

    if (!coupon?.code) return;
    if (
      coupon.minNights &&
      nights != null &&
      Number(nights) < Number(coupon.minNights)
    ) {
      addToast?.({
        title: "Minimum nights required",
        description: `This coupon requires at least ${coupon.minNights} nights.`,
        color: "danger",
      });
      return;
    }
    try {
      await callApply({ code: coupon.code, source: "card" });
    } catch {
      // handled
    }
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

        {fetchStatus === "loading" ? (
          <div className="flex justify-center items-center h-[30vh] bg-white">
            <div className="bg-black rounded-full flex justify-center items-center">
              <ButtonLoader />
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Manual Coupon Entry */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#ff6900] font-mono font-bold text-sm"
              />
              <Button
                onPress={handleManualApply}
                disabled={!couponCode.trim() || isApplyingManual}
                className="w-full bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c84d00] text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all active:scale-98"
              >
                {isApplyingManual ? "Applying..." : "APPLY"}
              </Button>
            </div>

            {/* Offers header */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Offers Available
                </h3>
                <span className="text-[10px] text-gray-400">T&C Apply</span>
              </div>

              {/* {fetchStatus === "loading" && (
                <div className="text-sm">Loading offers...</div>
              )} */}
              {fetchStatus === "failed" && (
                <div className="text-sm text-red-500">{fetchError}</div>
              )}

              {/* Coupon cards */}
              {(couponsToRender || []).map((coupon) => {
                const isThisApplying = applyingCode === coupon.code;
                const isApplied = appliedCoupon?.code === coupon.code;
                return (
                  <div
                    key={coupon.code}
                    className="border border-orange-100 bg-orange-50/30 rounded-2xl p-4 space-y-3 hover:border-orange-300 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-[11px] text-gray-500 mb-1">
                          Valid till: {coupon.validTillReadable}
                        </p>
                        <p className="text-xs text-gray-700 mb-2 leading-relaxed">
                          {coupon.description}
                        </p>
                        {coupon.minNights && (
                          <p className="text-xs text-[#ff6900] font-semibold mb-1">
                            Min nights: {coupon.minNights}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <FaTicketAlt className="w-4 h-4 text-[#ff6900]" />
                          <span className="font-mono font-bold text-gray-900 text-base">
                            {coupon.code}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCouponApply(coupon)}
                        disabled={isThisApplying || isApplied || coupon.isUsedOnThisDevice}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          coupon.isUsedOnThisDevice
                            ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                            : isApplied
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c84d00] text-white shadow-xs"
                        }`}
                      >
                        {coupon.isUsedOnThisDevice
                          ? "USED"
                          : isApplied
                          ? "✓ APPLIED"
                          : isThisApplying
                          ? "Applying..."
                          : "APPLY"}
                      </button>
                    </div>
                  </div>
                );
              })}

              {(couponsToRender || []).length === 0 &&
                fetchStatus !== "loading" && (
                  <div className="text-sm text-gray-500 text-center py-6">
                    No coupons available for this property
                  </div>
                )}
            </div>

            {applyStatus === "failed" && (
              <div className="text-sm text-red-500">
                Apply failed: {applyError}
              </div>
            )}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default CouponsDrawer;
