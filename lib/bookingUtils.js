

// lib/bookingUtils.js (or wherever it lives)
export const calculateBookingPrice = (pricePerNight, nights, appliedCoupon) => {
  const basePrice = Number(pricePerNight || 0) * Number(nights || 0);

  let discountAmount = 0;

  if (appliedCoupon) {
    // 1. Use server-provided discountAmount if available (preferred)
    if (typeof appliedCoupon.discountAmount === "number" && appliedCoupon.discountAmount > 0) {
      discountAmount = appliedCoupon.discountAmount;
    } else {
      // 2. Fallback: compute from flexible discountType and discountValue fields
      const discountType = (
        appliedCoupon.discountType ||
        appliedCoupon.type ||
        (appliedCoupon.discount && appliedCoupon.discount.type) ||
        "percentage"
      ).toLowerCase();

      const discountValue = Number(
        appliedCoupon.discountValue ??
        appliedCoupon.discountAmount ??
        (typeof appliedCoupon.discount === "number" ? appliedCoupon.discount : appliedCoupon.discount?.amount) ??
        appliedCoupon.amount ??
        0
      );

      const maxDiscount = Number(
        appliedCoupon.maxDiscount ??
        appliedCoupon.maxDiscountAmount ??
        Infinity
      );

      if (discountType === "fixed") {
        discountAmount = Math.min(discountValue, maxDiscount, basePrice);
      } else {
        // assume percentage
        discountAmount = (basePrice * discountValue) / 100;
        if (!Number.isFinite(discountAmount)) discountAmount = 0;
        discountAmount = Math.min(discountAmount, maxDiscount, basePrice);
      }
    }
  }

  // Round discount to 2 decimals to avoid weird floats
  discountAmount = Math.round(discountAmount * 100) / 100;

  const amountAfterDiscount = Math.max(0, basePrice - discountAmount);

  // Taxes (you used 18% previously)
  const taxAmount = Math.round(amountAfterDiscount * 0.18);

  const finalTotal = Math.round((amountAfterDiscount + taxAmount) * 100) / 100;

  return {
    basePrice,
    discountAmount,
    taxAmount,
    finalTotal,
  };
};
