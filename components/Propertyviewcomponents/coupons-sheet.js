// components/Propertyviewcomponents/coupons-sheet.js
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FaTicketAlt } from "react-icons/fa";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Gift, Check, Tag, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCouponsByProperty,
  applyCoupon,
  clearApplyState,
} from "@/Redux/Slices/couponsSlice";
import { getDeviceId } from "@/lib/deviceId";
import ButtonLoader from "../Loadercomponents/button-loader";
import { useToast } from "@/components/ui/toast-provider";

const CouponsSheet = ({
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
  const { addToast } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingManual, setIsApplyingManual] = useState(false);
  const [applyingCode, setApplyingCode] = useState(null);
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
  }, [isOpen, propertyId, dispatch]);

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
      return dt.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
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
      minNights: c.minNights ?? null,
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

  const callApply = async ({ code, source = "card" }) => {
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
          variant: "destructive",
          duration: 3500,
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
        title: "Coupon Applied",
        description: `${normalized.code} applied successfully!`,
        duration: 3000,
      });

      onClose();
      return normalized;
    } catch (err) {
      const msg = err?.message || applyError || "Failed to apply coupon";
      addToast?.({
        title: "Cannot Apply Coupon",
        description: msg,
        variant: "destructive",
        duration: 3000,
      });
      console.error("apply coupon error:", err);
      throw err;
    } finally {
      if (source === "manual") setIsApplyingManual(false);
      else setApplyingCode(null);
    }
  };

  const handleManualApply = async () => {
    if (isSubtotalInvalid) {
      addToast?.({
        title: "Cannot apply coupon",
        description: "Please select valid dates and accommodation first.",
        variant: "destructive",
        duration: 2500,
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
          title: "Minimum Nights Required",
          description: `This coupon requires a minimum of ${found.minNights} nights.`,
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
    }
    try {
      await callApply({ code: code.toUpperCase(), source: "manual" });
      setCouponCode("");
    } catch {}
  };

  const handleCouponApply = async (coupon) => {
    if (isSubtotalInvalid) {
      addToast?.({
        title: "Cannot apply coupon",
        description: "Please select valid dates and accommodation first.",
        variant: "destructive",
        duration: 2500,
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
        title: "Minimum Nights Required",
        description: `This coupon requires at least ${coupon.minNights} nights.`,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    try {
      await callApply({ code: coupon.code, source: "card" });
    } catch {}
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-white p-0 border-l border-neutral-200 flex flex-col h-full z-50 shadow-2xl"
      >
        {/* Header */}
        <SheetHeader className="p-6 border-b border-neutral-100 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#ff6900] flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <SheetTitle className="text-lg font-bold text-neutral-900 leading-tight">
                Coupons & Offers
              </SheetTitle>
              <p className="text-xs text-neutral-500">
                Apply a promo code to get instant discount
              </p>
            </div>
          </div>
        </SheetHeader>

        {/* Content */}
        {fetchStatus === "loading" ? (
          <div className="flex-1 flex justify-center items-center bg-white">
            <div className="bg-neutral-900 rounded-full p-4 flex items-center justify-center shadow-lg">
              <ButtonLoader />
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Manual Coupon Input Box */}
            <div className="p-6 border-b border-neutral-100 bg-neutral-50/50">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="uppercase font-mono font-bold text-sm bg-white border-neutral-200 focus:border-[#ff6900] focus:ring-[#ff6900] rounded-xl h-11"
                />
                <Button
                  onClick={handleManualApply}
                  disabled={!couponCode.trim() || isApplyingManual}
                  className="bg-[#ff6900] hover:bg-[#e05d00] text-white font-bold px-5 rounded-xl h-11 shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  {isApplyingManual ? "Applying..." : "APPLY"}
                </Button>
              </div>
            </div>

            {/* Scrollable Coupons List */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Available Offers
                  </h3>
                  <span className="text-[11px] text-neutral-400">T&C Apply</span>
                </div>

                {fetchStatus === "failed" && (
                  <div className="text-xs text-rose-500 p-3 bg-rose-50 rounded-xl border border-rose-100 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{fetchError}</span>
                  </div>
                )}

                {couponsToRender && couponsToRender.length > 0 ? (
                  couponsToRender.map((coupon) => {
                    const isThisApplying = applyingCode === coupon.code;
                    const isApplied = appliedCoupon?.code === coupon.code;

                    return (
                      <div
                        key={coupon.code}
                        className={`rounded-2xl p-4 border transition-all duration-200 ${
                          isApplied
                            ? "border-emerald-300 bg-emerald-50/40 shadow-xs"
                            : "border-neutral-200/80 bg-white hover:border-orange-200 hover:shadow-xs"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="font-mono font-black text-sm tracking-wide bg-neutral-100 text-neutral-800 px-2.5 py-0.5 rounded-md border border-neutral-200">
                                {coupon.code}
                              </span>
                              {coupon.isUsedOnThisDevice ? (
                                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                                  Already used on this device
                                </span>
                              ) : coupon.discountType === "percentage" ? (
                                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                                  {coupon.discountAmount}% OFF
                                </span>
                              ) : (
                                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                                  ₹{coupon.discountAmount} OFF
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">
                              {coupon.description}
                            </p>

                            <div className="flex items-center gap-3 mt-2 text-[11px] text-neutral-400">
                              <span>Valid till: {coupon.validTillReadable}</span>
                              {coupon.minNights && (
                                <>
                                  <span>•</span>
                                  <span className="text-[#ff6900] font-semibold">
                                    Min {coupon.minNights} nights
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <Button
                            size="sm"
                            onClick={() => handleCouponApply(coupon)}
                            disabled={isThisApplying || isApplied || coupon.isUsedOnThisDevice}
                            className={`rounded-xl text-xs font-bold px-4 py-2 shrink-0 transition-all cursor-pointer ${
                              coupon.isUsedOnThisDevice
                                ? "bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed hover:bg-neutral-100"
                                : isApplied
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 cursor-default"
                                : "bg-[#ff6900] hover:bg-[#e05d00] text-white shadow-xs"
                            }`}
                          >
                            {coupon.isUsedOnThisDevice
                              ? "USED"
                              : isApplied
                              ? "✓ APPLIED"
                              : isThisApplying
                              ? "Applying..."
                              : "APPLY"}
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : fetchStatus !== "loading" ? (
                  <div className="text-center py-12 text-neutral-400">
                    <Tag className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">No coupons available for this property</p>
                    <p className="text-xs mt-1">There are no active coupons for this property right now.</p>
                  </div>
                ) : null}
              </div>
            </ScrollArea>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CouponsSheet;
