export const calculateBookingPrice = (price, nights, appliedCoupon) => {
  const basePrice = price * nights;
  const discountAmount = appliedCoupon
    ? Math.min((basePrice * appliedCoupon.discount) / 100, appliedCoupon.maxDiscount)
    : 0;
  const totalPrice = basePrice - discountAmount;
  const taxAmount = Math.round(totalPrice * 0.18);
  return {
    basePrice,
    discountAmount,
    taxAmount,
    finalTotal: totalPrice + taxAmount,
  };
};
